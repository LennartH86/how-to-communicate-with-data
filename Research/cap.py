import json, os, urllib.request, ssl, sys, time
sys.stdout.reconfigure(encoding="utf-8")
cfg=json.load(open(os.path.expanduser("~/.claude/credentials/capacities_config.json")))
BASE="https://api.capacities.io"
def req(method,path,body=None,legacy=False):
    tok=cfg["legacy_api_token"] if legacy else cfg["api_token"]
    r=urllib.request.Request(BASE+path,data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization":f"Bearer {tok}","Content-Type":"application/json"},method=method)
    for a in range(5):
        try:
            with urllib.request.urlopen(r,timeout=60) as resp:
                t=resp.read().decode(); return json.loads(t) if t else {}
        except urllib.error.HTTPError as e:
            if e.code==429: time.sleep(5*(a+1)); continue
            return {"_error":e.code,"_body":e.read().decode()[:500]}

def upload_image(path, title):
    size=os.path.getsize(path); name=os.path.basename(path)
    init=req("POST","/object/media/upload",{"fileName":name,"fileSize":size,"fileType":"image/png","title":title})
    if "id" not in init: return init
    data=open(path,"rb").read(); ps=init.get("partSize",size)
    for n in range((size+ps-1)//ps):
        chunk=data[n*ps:(n+1)*ps]
        r=urllib.request.Request(f"{BASE}/object/media/upload/part?id={init['id']}&partNumber={n+1}",data=chunk,
            headers={"Authorization":f"Bearer {cfg['api_token']}","Content-Type":"application/octet-stream"},method="PUT")
        urllib.request.urlopen(r,timeout=120).read()
    return req("POST","/object/media/upload/complete",{"id":init["id"]})

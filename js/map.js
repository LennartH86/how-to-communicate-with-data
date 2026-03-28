/**
 * D3 world map with customer visit city markers (Slide 2)
 */
(function () {
  'use strict';

  const CITIES = [
    { name: "Seattle",          lon: -122.33, lat: 47.61 },
    { name: "Las Vegas",        lon: -115.14, lat: 36.17 },
    { name: "San Francisco",    lon: -122.42, lat: 37.77 },
    { name: "San Diego",        lon: -117.16, lat: 32.72 },
    { name: "New York",         lon: -74.01,  lat: 40.71 },
    { name: "London",           lon: -0.13,   lat: 51.51 },
    { name: "Riga",             lon: 24.11,   lat: 56.95 },
    { name: "Vilnius",          lon: 25.28,   lat: 54.69 },
    { name: "Tallinn",          lon: 24.75,   lat: 59.44 },
    { name: "Hamburg",          lon: 9.99,    lat: 53.55 },
    { name: "Mönchengladbach",  lon: 6.44,    lat: 51.19 },
    { name: "Braunschweig",     lon: 10.52,   lat: 52.27 },
    { name: "Wolfsburg",        lon: 10.79,   lat: 52.42 },
    { name: "Berlin",           lon: 13.40,   lat: 52.52 },
    { name: "Dresden",          lon: 13.74,   lat: 51.05 },
    { name: "Frankfurt",        lon: 8.68,    lat: 50.11 },
    { name: "Düsseldorf",       lon: 6.79,    lat: 51.23 },
    { name: "Darmstadt",        lon: 8.65,    lat: 49.87 },
    { name: "Heidelberg",       lon: 8.69,    lat: 49.40 },
    { name: "Stuttgart",        lon: 9.18,    lat: 48.78 },
    { name: "München",          lon: 11.58,   lat: 48.14 },
    { name: "Iphofen",          lon: 10.27,   lat: 49.70 },
    { name: "Nürnberg",         lon: 11.08,   lat: 49.45 },
    { name: "Kassel",           lon: 9.50,    lat: 51.31 },
    { name: "Kraków",           lon: 19.94,   lat: 50.06 },
    { name: "Budapest",         lon: 19.04,   lat: 47.50 },
    { name: "Wien",             lon: 16.37,   lat: 48.21 },
    { name: "Basel",            lon: 7.59,    lat: 47.56 },
    { name: "Mannheim",         lon: 8.47,    lat: 49.49 }
  ];

  function renderMap() {
    const container = document.getElementById('world-map');
    if (!container) return;
    if (typeof d3 === 'undefined' || typeof topojson === 'undefined') {
      setTimeout(renderMap, 200);
      return;
    }

    const width  = container.clientWidth  || 1300;
    const height = container.clientHeight || 820;

    container.innerHTML = '';

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background', '#f5f7fa');

    const projection = d3.geoNaturalEarth1()
      .scale(width / 6.5)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Fetch world topology
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(world => {
        const countries = topojson.feature(world, world.objects.countries);

        // Graticule
        svg.append('path')
          .datum(d3.geoGraticule()())
          .attr('d', path)
          .attr('fill', 'none')
          .attr('stroke', '#e2e6ed')
          .attr('stroke-width', 0.5);

        // Countries
        svg.selectAll('.country')
          .data(countries.features)
          .enter()
          .append('path')
          .attr('class', 'country')
          .attr('d', path)
          .attr('fill', '#edf0f5')
          .attr('stroke', '#d1d5db')
          .attr('stroke-width', 0.7);

        // Sphere outline
        svg.append('path')
          .datum({ type: 'Sphere' })
          .attr('d', path)
          .attr('fill', 'none')
          .attr('stroke', '#d1d5db')
          .attr('stroke-width', 1);

        // City dots
        const cityGroup = svg.selectAll('.city')
          .data(CITIES)
          .enter()
          .append('g')
          .attr('class', 'city')
          .attr('transform', d => {
            const [x, y] = projection([d.lon, d.lat]);
            return `translate(${x},${y})`;
          });

        // Pulse ring
        cityGroup.append('circle')
          .attr('r', 10)
          .attr('fill', 'none')
          .attr('stroke', '#00d4e0')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.4);

        // Core dot
        cityGroup.append('circle')
          .attr('r', 5)
          .attr('fill', '#00d4e0')
          .attr('stroke', 'white')
          .attr('stroke-width', 1.5)
          .style('cursor', 'pointer');

        // Tooltip on hover
        const tooltip = d3.select(container)
          .append('div')
          .style('position', 'absolute')
          .style('background', 'white')
          .style('border', '1.5px solid #e2e6ed')
          .style('border-radius', '8px')
          .style('padding', '6px 14px')
          .style('font-size', '16px')
          .style('font-weight', '600')
          .style('pointer-events', 'none')
          .style('opacity', 0)
          .style('white-space', 'nowrap')
          .style('box-shadow', '0 2px 12px rgba(0,0,0,0.1)');

        cityGroup
          .on('mouseover', (event, d) => {
            tooltip.style('opacity', 1).text(d.name);
          })
          .on('mousemove', (event) => {
            const [mx, my] = d3.pointer(event, container);
            tooltip.style('left', (mx + 12) + 'px').style('top', (my - 8) + 'px');
          })
          .on('mouseout', () => tooltip.style('opacity', 0));
      })
      .catch(() => {
        // Fallback: simple text
        svg.append('text')
          .attr('x', width / 2).attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .attr('fill', '#6b7280')
          .attr('font-size', 20)
          .text('Map loading requires internet connection');
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Only render when slide 2 becomes active
    document.addEventListener('slidechange', e => {
      if (e.detail.slide === 2) {
        setTimeout(renderMap, 50);
      }
    });
    // Also render immediately if starting on slide 2
    if (window.location.hash === '#slide-2' || !window.location.hash) {
      setTimeout(renderMap, 300);
    }
  });
})();

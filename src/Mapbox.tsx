'use client';

import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';


const Mapbox: React.FC = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const [selectedLayer, setSelectedLayer] = useState<string>(
    'satellite-streets-v12'
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapContainer = useRef<any>(null);

    const [allLayersVisible, setAllLayersVisible] = useState(true);
    const [combinedLayerIds, setCombinedLayerIds] = useState<string[]>([]);

  const layerOptions = [
    { value: 'mapbox/satellite-streets-v12', label: 'Satellite' },
    { value: 'mapbox/streets-v12', label: 'Street' },
    { value: 'mapbox/outdoors-v11', label: 'Outdoors' },
    { value: 'mapbox/light-v10', label: 'Light' },
    { value: 'mapbox/dark-v10', label: 'Dark' },
    { value: 'mapbox/navigation-day-v1', label: 'Navigation' },
  ];

  const handleLayerChange = (value: string) => {
    if (
      value === 'mapbox/satellite-streets-v12' ||
      value === 'mapbox/streets-v12' ||
      value === 'mapbox/outdoors-v11' ||
      value === 'mapbox/light-v10' ||
      value === 'mapbox/dark-v10' ||
      value === 'mapbox/navigation-day-v1'
    ) {
      map?.setStyle(`mapbox://styles/${value}`);
      // Check if 'unclustered-point' layer is included in the new style
      setSelectedLayer(value);
    } else {
      const visibility = map?.getLayoutProperty(value, 'visibility');
      console.log(`Visibility of layer ${value}: ${visibility}`);

      if (visibility === 'visible') {
        map?.setLayoutProperty(value, 'visibility', 'none');
      } else {
        map?.setLayoutProperty(value, 'visibility', 'visible');
      }
    }
  };

    const toggleAllLayers = () => {
      const newVisibility = allLayersVisible ? 'none' : 'visible';
      combinedLayerIds.forEach((id) => {
        map?.setLayoutProperty(id, 'visibility', newVisibility);
      });
      setAllLayersVisible(!allLayersVisible);
    };


  useEffect(() => {
    if (map) return;

    const mapboxMap = new mapboxgl.Map({
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${selectedLayer}`,
      center: [0, 0],
      zoom: 16,
    });


    setMap(mapboxMap);


  }, [map, selectedLayer]);

  useEffect(() => {
      if (!map) return;

    function loadData() {
      console.log('function called');
      const combinedLayerIds: string[] = [];

      if (map) {
        // Add source and layers
        map?.addSource('routeSource', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [-122.48369693756104, 37.83381888486939],
                [-122.48348236083984, 37.83317489144141],
                [-122.48339653015138, 37.83270036637107],
                [-122.48356819152832, 37.832056363179625],
                [-122.48404026031496, 37.83114119107971],
                [-122.48404026031496, 37.83049717427869],
                [-122.48348236083984, 37.829920943955045],
                [-122.48356819152832, 37.82954808664175],
                [-122.48507022857666, 37.82944639795659],
                [-122.48610019683838, 37.82880236636284],
                [-122.48695850372314, 37.82931081282506],
                [-122.48700141906738, 37.83080223556934],
                [-122.48751640319824, 37.83168351665737],
                [-122.48803138732912, 37.832158048267786],
                [-122.48888969421387, 37.83297152392784],
                [-122.48987674713133, 37.83263257682617],
                [-122.49043464660643, 37.832937629287755],
                [-122.49125003814696, 37.832429207817725],
                [-122.49163627624512, 37.832564787218985],
                [-122.49223709106445, 37.83337825839438],
                [-122.49378204345702, 37.83368330777276],
              ],
            },
          },
        });
        map?.addLayer({
          id: 'routeLayer',
          type: 'line',
          source: 'routeSource',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#33bb6a',
            'line-width': 8,
          },
        });

        combinedLayerIds.push('routeLayer');
        setCombinedLayerIds(combinedLayerIds);
      }
    }


    map?.on('style.load', () => {
      loadData();
    });
  }, [map]);

  return (
    <>
      <div className='h-screen w-full relative flex flex-col' ref={mapContainer}>
        <DropdownMenu>
          <DropdownMenuTrigger className='w-8 h-8 border-none absolute top-0 right-0 z-10 rounded-lg mt-2 mr-2 p-2 bg-white'>
            <Square3Stack3DIcon className=' h-full w-full text-black ' />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={selectedLayer}
              onValueChange={handleLayerChange}
            >
              <DropdownMenuLabel>Layers</DropdownMenuLabel>
              {layerOptions.map((option, index) => (
                <DropdownMenuRadioItem
                  key={index}
                  value={option.value}
                  className='flex items-center'
                >
                  <span className='flex-1'>{option.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel>Assets</DropdownMenuLabel>

              <DropdownMenuCheckboxItem
                checked={allLayersVisible}
                onCheckedChange={toggleAllLayers}
              >
                Trees
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default Mapbox;

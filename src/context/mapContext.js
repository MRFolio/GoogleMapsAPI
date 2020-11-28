import { createContext, useContext, useEffect, useState } from "react";

const url = "https://eersc.usgs.gov/api/uswtdb/v1/turbines?&limit=100";

const MapContext = createContext();

const MapProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState([]);
  const [selectedMill, setSelectedMill] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data) {
          const windmills = data.map(
            ({
              case_id: id,
              p_name: name,
              t_state: state,
              t_county: county,
              p_year: year,
              p_cap: capacity,
              t_rd: diameter,
              t_ttlh: height,
              xlong: lng,
              ylat: lat,
            }) => {
              return {
                id,
                name,
                state,
                county,
                year,
                capacity,
                diameter,
                height,
                lng,
                lat,
              };
            }
          );
          setMapData(windmills);
        } else {
          setMapData([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MapContext.Provider
      value={{ loading, mapData, selectedMill, setSelectedMill }}
    >
      {children}
    </MapContext.Provider>
  );
};
//custom hook
const useMapContext = () => useContext(MapContext);

export { useMapContext, MapProvider };

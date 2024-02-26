// import geolib from 'geolib';
// import { useQuery } from '@tanstack/react-query';
// import api from './index';
// import UseLocation from './useLocation';
// const FetchNearProviders = async (CurrentLocation) => {
//   // console.log("CurrentLocation:", CurrentLocation);
  
//   try {
//     let allProviders = [];
//     let page =  1; // Start with the first page
//     const maxDistance =  10000; // Maximum distance in meters
    
//     // Function to fetch providers and calculate distances
//     const fetchAndFilterProviders = async (location, page) => {
//       const response = await api.get(`/api/providers?populate=*&pagination[page]=${parseInt(page,  10)}`);
//       const currentProvidersPage = response?.data?.data || [];
//       // Calculate distances and filter providers
//       const providersWithDistances = currentProvidersPage.map((provider) => {
//           const providerLocation = provider?.attributes?.googleMapLocation;
//           console.log("the provider ", provider?.attributes?.googleMapLocation);
//         if (providerLocation && location) {
//           const distance = geolib?.getDistance(
//             {
//               latitude: providerLocation?.coordinate?.latitude,
//               longitude: providerLocation?.coordinate?.longitude,
//             },
//             {
//               latitude: location?.latitude,
//               longitude: location?.longitude,
//             }
//           );
//           return { provider, distance };
//         }
//         return { provider, distance: null };
//       });

//       // Filter providers within the maximum distance
//       const nearbyProviders = providersWithDistances.filter(({ distance }) => distance <= maxDistance);

//       // Return both nearbyProviders and the next page information
//       return { nearbyProviders, nextPage: response?.data?.meta?.pagination.pageCount };
//     };

//     while (true) {
//       console.log("filter....................");
//       const { nearbyProviders, nextPage } = await fetchAndFilterProviders(CurrentLocation?.coordinate, page);
//       allProviders = [...allProviders, ...nearbyProviders];

//       if (nextPage === page) {
//         break; // No more pages, exit the loop
//       }

//       // Move to the next page
//       page++;
//     }

//     return allProviders;
//   } catch (error) {
//     console.log("Error fetching providers:", error);
//     throw error;
//   }
// };

// export default function useNearProviders() {
//   console.log("filtering provider..........");
  
//   // Call UseLocation at the top level of your hook
  
//   const { location: CurrentLocation } = UseLocation();

//   const { data, isLoading, isError } = useQuery(
//     { queryKey: ["nearProvider"], queryFn:()=> FetchNearProviders(CurrentLocation) }
//   );
   
//   return {
//     data,
//     isLoading,
//     isError
//   };
// }

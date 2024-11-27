import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { GrLicense } from "react-icons/gr";
import CardComponent from "../../components/card/CardComponent";
import { fetchUsers, fetchLicenses } from "../../Api/api";
import { toast } from "react-toastify";
import LoaderComponent from "../../components/Common/LoaderComponent";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  users: {
    label: "Users",
    color: "#2563eb",
  },
  licenses: {
    label: "Licenses",
    color: "#60a5fa",
  },
};

const SuperAdminDashboard = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const [userData, setUserData] = useState({ count: 0, chartData: [] });
  const [licenseData, setLicenseData] = useState({ count: 0, chartData: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userResponse, licenseResponse] = await Promise.all([
          fetchUsers(),
          fetchLicenses(),
        ]);

        let users, licenses;

        if (userResponse.ok && licenseResponse.ok) {
          users = await userResponse.json();
          licenses = await licenseResponse.json();
        } else {
          setError("Api error: Data not available.");
          toast.error("Api error: Data not available.");
        }

        const userChartData = [
          users.length + 496,
          users.length + 1000,
          users.length + 2000,
          users.length + 1500,
          users.length + 3000,
          users.length + 2500,
          users.length + 2100,
          users.length + 2600,
          users.length + 2300,
          users.length + 2200,
          users.length + 2100,
          users.length + 100,
        ];

        setUserData({
          count: users.length,
          chartData: userChartData,
        });

        const licenseChartData = [
          licenses.length,
          licenses.length + 200,
          licenses.length + 100,
          licenses.length + 400,
          licenses.length + 300,
          licenses.length + 600,
          licenses.length + 700,
          licenses.length + 800,
          licenses.length + 400,
          licenses.length + 500,
          licenses.length + 200,
          licenses.length + 100,
        ];

        setLicenseData({
          count: licenses.length,
          chartData: licenseChartData,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardData = [
    {
      icon: <FaUsers className="w-10 h-10 text-blue-500" />,
      title: "Total Users",
      initialCount: userData.count,
      chartData: userData.chartData,
      chartLabel: "Users",
    },
    {
      icon: <GrLicense className="w-10 h-10 text-green-500" />,
      title: "Total License",
      initialCount: licenseData.count,
      chartData: licenseData.chartData,
      chartLabel: "Licenses",
    },
  ];

  const transformChartData = (data) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return data.map((value, index) => ({
      month: months[index],
      value: value,
    }));
  };

  const handleCardClick = (index) => {
    setSelectedCard(index);
  };

  return (
    <div className="w-full rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-secondary-foreground tracking-widest">
        Dashboard
      </h1>

      {loading ? (
        <LoaderComponent />
      ) : error ? (
        <div className="w-full py-5 px-3 bg-background dark:bg-gray-800 rounded-md">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {cardData.map((card, index) => (
              <CardComponent
                key={index}
                {...card}
                onClick={() => handleCardClick(index)}
                isSelected={selectedCard === index}
              />
            ))}
          </div>

          {/* <div className="flex gap-6"> */}
          <div className="grid grid-cols-2 gap-6">
            <div className="w-full bg-background dark:bg-gray-800 rounded-lg shadow-md dark:shadow-white p-4">
              <h2 className="text-xl font-semibold mb-4 text-secondary-foreground">
                {selectedCard !== null
                  ? cardData[selectedCard].title
                  : "Selected Card Data"}
              </h2>

              <ChartContainer config={chartConfig} className="w-full">
                <BarChart
                  data={
                    selectedCard !== null
                      ? transformChartData(cardData[selectedCard].chartData)
                      : []
                  }
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    className="text-secondary-foreground"
                  />
                  <Bar dataKey="value" fill="#2563eb" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="w-full">
              {cardData.map(
                (card, index) =>
                  index !== selectedCard && (
                    <div
                      key={index}
                      className="rounded-lg shadow-lg dark:shadow-sm dark:shadow-white p-4 bg-background dark:bg-gray-800"
                    >
                      <h3 className="text-lg font-semibold mb-2 text-secondary-foreground">
                        {card.title}
                      </h3>
                      <ChartContainer config={chartConfig} className="w-full">
                        <BarChart data={transformChartData(card.chartData)}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                          />
                          <ChartTooltip
                            content={<ChartTooltipContent />}
                            className="text-secondary-foreground"
                          />
                          <Bar dataKey="value" fill="#60a5fa" radius={4} />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuperAdminDashboard;

// import React, { useState, useEffect } from "react";
// import { FaUsers } from "react-icons/fa";
// import { GrLicense } from "react-icons/gr";
// import CardComponent from "../../components/card/CardComponent";
// import { fetchUsers, fetchLicenses } from "../../Api/api";
// import { toast } from "react-toastify";
// import LoaderComponent from "../../components/Common/LoaderComponent";
// import LineChart from "../../components/chart/LineChart";

// const SuperAdminDashboard = () => {
//   const [selectedCard, setSelectedCard] = useState(0);
//   const [userData, setUserData] = useState({ count: 0, chartData: [] });
//   const [licenseData, setLicenseData] = useState({ count: 0, chartData: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Attempt to fetch data from API
//         const [userResponse, licenseResponse] = await Promise.all([
//           fetchUsers(),
//           fetchLicenses(),
//         ]);

//         let users, licenses;

//         // Check if API calls were successful
//         if (userResponse.ok && licenseResponse.ok) {
//           users = await userResponse.json();
//           licenses = await licenseResponse.json();
//         } else {
//           // If any API call fails,
//           // set error state and show toast
//           setError("Api error: Data not available.");
//           toast.error("Api error: Data not available.");
//         }

//         // Process user data
//         const userChartData = [
//           users.length + 496,
//           users.length + 1000,
//           users.length + 2000,
//           users.length + 1500,
//           users.length + 3000,
//           users.length + 2500,
//           users.length + 2100,
//           users.length + 2600,
//           users.length + 2300,
//           users.length + 2200,
//           users.length + 2100,
//           users.length + 100,
//         ];

//         setUserData({
//           count: users.length,
//           chartData: userChartData,
//         });

//         // Process license data
//         const licenseChartData = [
//           licenses.length,
//           licenses.length + 200,
//           licenses.length + 100,
//           licenses.length + 400,
//           licenses.length + 300,
//           licenses.length + 600,
//           licenses.length + 700,
//           licenses.length + 800,
//           licenses.length + 400,
//           licenses.length + 500,
//           licenses.length + 200,
//           licenses.length + 100,
//         ];

//         setLicenseData({
//           count: licenses.length,
//           chartData: licenseChartData,
//         });

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to fetch data.");
//         // setError(`Failed to fetch data: ${error.message}`);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Define the card data dynamically based on fetched data
//   const cardData = [
//     {
//       icon: <FaUsers className="w-10 h-10 text-blue-500" />,
//       title: "Total Users",
//       initialCount: userData.count,
//       chartData: userData.chartData,
//       chartLabel: "Users over time",
//     },
//     {
//       icon: <GrLicense className="w-10 h-10 text-green-500" />,
//       title: "Total License",
//       initialCount: licenseData.count,
//       chartData: licenseData.chartData,
//       chartLabel: "Licenses over time",
//     },
//   ];

//   const handleCardClick = (index) => {
//     setSelectedCard(index);
//   };

//   return (
//     <div className="w-full rounded-lg">
//        <h1 className="text-3xl font-semibold text-secondary-foreground tracking-widest mb-5">
//         Dashboard
//       </h1>

//       {loading ? (
//         <LoaderComponent />
//       ) : error ? (
//         <div className="w-full py-5 px-3 bg-background dark:bg-gray-800 rounded-md">
//           <p className="text-red-500">{error}</p>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-4 gap-6 mb-8">
//             {cardData.map((card, index) => (
//               <CardComponent
//                 key={index}
//                 {...card}
//                 onClick={() => handleCardClick(index)}
//                 isSelected={selectedCard === index}
//               />
//             ))}
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="bg-background dark:bg-gray-800 rounded-lg shadow-md dark:shadow-white p-4">
//               <h2 className="text-xl font-semibold mb-4 text-secondary-foreground">
//                 {selectedCard !== null
//                   ? cardData[selectedCard].title
//                   : "Selected Card Data"}
//               </h2>
//               {selectedCard !== null ? (
//                 <LineChart
//                   data={cardData[selectedCard].chartData}
//                   label={cardData[selectedCard].chartLabel}
//                 />
//               ) : (
//                 <p>Select a card to view its data</p>
//               )}
//             </div>
//             <div className="border border-red-500">
//               {cardData.map(
//                 (card, index) =>
//                   index !== selectedCard && (
//                     <div
//                       key={index}
//                       className="rounded-lg shadow-lg dark:shadow-sm dark:shadow-white p-4 bg-background dark:bg-gray-800"
//                     >
//                       <h3 className="text-lg font-semibold mb-2 text-secondary-foreground">
//                         {card.title}
//                       </h3>
//                       <LineChart
//                         data={card.chartData}
//                         label={card.chartLabel}
//                       />
//                     </div>
//                   )
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default SuperAdminDashboard;

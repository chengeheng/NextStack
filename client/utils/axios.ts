// libs/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // 示例 API
  timeout: 5000,
});

export default axiosInstance;
// You can add interceptors if needed
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Add any request modifications here
//     return config;
//   },
//   (error) => {
//     // Handle request errors here
//     return Promise.reject(error);
//   }
// );
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Handle successful responses here
//     return response;
//   },
//   (error) => {
//     // Handle response errors here
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       console.error("Response error:", error.response.data);
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error("Request error:", error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error("Error:", error.message);
//     }
//     return Promise.reject(error);
//   }
//   (error) => {
//     // Handle response errors here
//     return Promise.reject(error);
//   }
// );
//             <div className="grid w-full items-center gap-2">
//               <button
//                 className="w-full"
//                 onClick={() => {
//                   // Handle button click
//                 }}
//               >
//                 <span className="text-sm font-medium">Sign in with Google</span>
//               </button>
//               <button
//                 className="w-full"
//                 onClick={() => {
//                   // Handle button click
//                 }}
//               >
//                 <span className="text-sm font-medium">Sign in with GitHub</span>
//               </button>
//             </div>
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-background px-2 text-muted-foreground">
//                   Or continue with
//                 </span>
//               </div>
//             </div>
//             <form className="grid w-full gap-6">
//               <UserAuthForm />
//             </form>
//             <p className="px-8 text-center text-sm text-muted-foreground">
//               By clicking continue, you agree to our{" "}
//               <a
//                 href="/terms"
//                 className="underline underline-offset-4 hover:text-primary"
//               >
//                 Terms of Service
//               </a>{" "}
//               and{" "}
//               <a
//                 href="/privacy"
//                 className="underline underline-offset-4 hover:text-primary"
//               >
//                 Privacy Policy
//               </a>
//               .
//             </p>
//           </div>
//           <div className="absolute inset-0 bg-zinc-900" />
//           <div className="relative z-20 flex items-center text-lg font-medium">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="mr-2 h-6 w-6"
//             >
//               <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
//             </svg>
//             Acme Inc
//           </div>
//           <div className="relative z-20 mt-auto">
//             <blockquote className="space-y-2">
//               <p className="text-lg">
//                 &ldquo;This library has saved me countless hours of work and
//                 helped me deliver stunning designs to my clients faster than
//                 ever before.&rdquo;
//               </p>
//               <footer className="text-sm">Sofia Davis</footer>
//             </blockquote>
//           </div>
//           <div className="lg:p-8">
//           <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//             <div className="flex flex-col space-y-2 text-center">
//               <h1 className="text-2xl font-semibold tracking-tight">
//                 Sign in with your account
//               </h1>
//               {/* <p className="text-sm text-muted-foreground">
//                 Enter your account below to Login
//               </p> */}

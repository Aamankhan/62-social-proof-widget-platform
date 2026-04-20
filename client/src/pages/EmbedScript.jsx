// import React, { useState, useEffect } from 'react';
// import Button from '../components/common/Button';
// import { getSettings } from '../services/api';

// export default function EmbedScript() {
//   const [apiKey, setApiKey] = useState('');
//   const [copied, setCopied] = useState(false);
//   const domain = window.location.origin;

//   useEffect(() => {
//     loadApiKey();
//   }, []);

//   const loadApiKey = async () => {
//     try {
//       const settings = await getSettings();
//       setApiKey(settings.apiKey);
//     } catch (error) {
//       console.error('Error loading API key:', error);
//     }
//   };

//   const embedCode = `<script src="${domain}/widget.js" data-api-key="${apiKey}"></script>`;

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(embedCode);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold text-gray-900 mb-6">Embed Script</h1>
      
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h2 className="text-lg font-medium text-gray-900 mb-4">Installation Instructions</h2>
        
//         <div className="space-y-4">
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <div className="flex items-start gap-3">
//               <i className="fa-solid fa-info-circle text-yellow-600 mt-0.5"></i>
//               <div className="text-sm text-yellow-800">
//                 <p className="font-medium mb-1">Important:</p>
//                 <p>Copy the code below and paste it just before the closing &lt;/body&gt; tag of your website.</p>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Embed Code
//             </label>
//             <div className="bg-gray-900 rounded-lg p-4">
//               <code className="text-green-400 text-sm break-all">
//                 {embedCode}
//               </code>
//             </div>
//             <Button onClick={copyToClipboard} className="mt-3">
//               <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} mr-2`}></i>
//               {copied ? 'Copied!' : 'Copy Code'}
//             </Button>
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Guides</h2>
        
//         <div className="space-y-4">
//           <div className="border rounded-lg p-4">
//             <div className="flex items-center gap-3 mb-2">
//               <i className="fa-brands fa-shopify text-2xl text-gray-700"></i>
//               <h3 className="font-medium">Shopify</h3>
//             </div>
//             <p className="text-sm text-gray-600">Add the code to theme.liquid file before closing &lt;/body&gt; tag</p>
//           </div>
          
//           <div className="border rounded-lg p-4">
//             <div className="flex items-center gap-3 mb-2">
//               <i className="fa-brands fa-wordpress text-2xl text-gray-700"></i>
//               <h3 className="font-medium">WordPress</h3>
//             </div>
//             <p className="text-sm text-gray-600">Add using a custom HTML block or edit footer.php</p>
//           </div>
          
//           <div className="border rounded-lg p-4">
//             <div className="flex items-center gap-3 mb-2">
//               <i className="fa-brands fa-react text-2xl text-gray-700"></i>
//               <h3 className="font-medium">React</h3>
//             </div>
//             <p className="text-sm text-gray-600">Add to public/index.html or use react-helmet</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { getSettings } from '../services/api';

export default function EmbedScript() {
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);

  // Detect frontend + backend domain
  const frontendDomain = window.location.origin;

  // If running on Vite (5173), use backend (5000)
  const scriptDomain = frontendDomain.includes(':5173')
    ? frontendDomain.replace(':5173', ':5000')
    : frontendDomain;

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const settings = await getSettings();
      setApiKey(settings.apiKey);
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const embedCode = `<script src="${scriptDomain}/widget.js" data-api-key="${apiKey}" async></script>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Embed Script
      </h1>

      {/* Installation Box */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Installation Instructions
        </h2>

        <div className="space-y-4">
          {/* Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-info text-yellow-600 mt-0.5"></i>

              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important:</p>
                <p>
                  Copy the code below and paste it before the closing
                  &lt;/body&gt; tag of your website.
                </p>
              </div>
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Embed Code
            </label>

            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-green-400 text-sm whitespace-pre-wrap break-all">
                {embedCode}
              </code>
            </div>

            <Button onClick={copyToClipboard} className="mt-3">
              <i
                className={`fa-solid ${
                  copied ? 'fa-check' : 'fa-copy'
                } mr-2`}
              ></i>

              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
        </div>
      </div>

      {/* Guides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Platform Guides
        </h2>

        <div className="space-y-4">
          {/* Shopify */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-brands fa-shopify text-2xl text-gray-700"></i>
              <h3 className="font-medium">Shopify</h3>
            </div>

            <p className="text-sm text-gray-600">
              Add code inside theme.liquid before closing &lt;/body&gt; tag.
            </p>
          </div>

          {/* WordPress */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-brands fa-wordpress text-2xl text-gray-700"></i>
              <h3 className="font-medium">WordPress</h3>
            </div>

            <p className="text-sm text-gray-600">
              Add using custom HTML block or footer.php.
            </p>
          </div>

          {/* React */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-brands fa-react text-2xl text-gray-700"></i>
              <h3 className="font-medium">React</h3>
            </div>

            <p className="text-sm text-gray-600">
              Add in public/index.html or use React Helmet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
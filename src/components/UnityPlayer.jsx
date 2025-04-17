import React, { useState, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "./UnityPlayer.css";

function UnityPlayer() {
  const [fileFormat, setFileFormat] = useState("compressed");
  const [attempts, setAttempts] = useState(0);
  const [canvasVisible, setCanvasVisible] = useState(false);

  // Define file paths based on current format
  const getUnityFiles = () => {
    const BASE_PATH = "/react-unity-showcase-demo/unity-build/Build/";

    if (fileFormat === "uncompressed") {
      return {
        loaderUrl: `${BASE_PATH}f2ba0865912f192eb26d6e4186bcdd66.loader.js`,
        dataUrl: `${BASE_PATH}11e1b4aba4a6a68646ad26b564cf87bd.data`,
        frameworkUrl: `${BASE_PATH}faf34f3658a59ed5c0341ae9b631b7a0.framework.js`,
        codeUrl: `${BASE_PATH}1410edb529b39ed01e1329d53fe3ecd5.wasm`,
      };
    } else {
      return {
        loaderUrl: `${BASE_PATH}f2ba0865912f192eb26d6e4186bcdd66.loader.js`,
        dataUrl: `${BASE_PATH}11e1b4aba4a6a68646ad26b564cf87bd.data.br`,
        frameworkUrl: `${BASE_PATH}faf34f3658a59ed5c0341ae9b631b7a0.framework.js.br`,
        codeUrl: `${BASE_PATH}1410edb529b39ed01e1329d53fe3ecd5.wasm.br`,
      };
    }
  };

  // Get the Unity context
  const { unityProvider, isLoaded, loadingProgression, loadingError } =
    useUnityContext({
      ...getUnityFiles(),
      webglContextAttributes: {
        preserveDrawingBuffer: true,
        alpha: false,
        backgroundColor: "#ffffff",
        premultipliedAlpha: false,
      },
    });

  // Calculate loading percentage
  const loadingPercentage = Math.round(loadingProgression * 100);

  // Show the Unity canvas only when fully loaded
  useEffect(() => {
    if (isLoaded) {
      // Add a short delay to ensure the Unity content is fully rendered
      setTimeout(() => {
        setCanvasVisible(true);
      }, 300);
    } else {
      setCanvasVisible(false);
    }
  }, [isLoaded]);

  // Check for existence of files
  useEffect(() => {
    const checkFile = async (url) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
      } catch (e) {
        return false;
      }
    };

    const checkFiles = async () => {
      // Only check on first attempt
      if (attempts > 0) return;

      // Check compressed files first
      const compressedFiles = {
        framework:
          "/unity-build/Build/faf34f3658a59ed5c0341ae9b631b7a0.framework.js.br",
        data: "/unity-build/Build/11e1b4aba4a6a68646ad26b564cf87bd.data.br",
      };

      const uncompressedFiles = {
        framework:
          "/unity-build/Build/faf34f3658a59ed5c0341ae9b631b7a0.framework.js",
        data: "/unity-build/Build/11e1b4aba4a6a68646ad26b564cf87bd.data",
      };

      // Check if compressed files exist
      const compressedExists = await checkFile(compressedFiles.framework);

      // Check if uncompressed files exist
      const uncompressedExists = await checkFile(uncompressedFiles.framework);

      console.log("File check:", {
        compressed: compressedExists,
        uncompressed: uncompressedExists,
      });

      // Set the appropriate format based on what exists
      if (compressedExists) {
        setFileFormat("compressed");
      } else if (uncompressedExists) {
        setFileFormat("uncompressed");
      }
    };

    checkFiles();
  }, [attempts]);

  // Handle errors by switching formats
  useEffect(() => {
    if (loadingError && attempts < 2) {
      console.log(`Loading error (attempt ${attempts + 1}):`, loadingError);

      // Toggle between compressed and uncompressed
      setFileFormat((prev) =>
        prev === "compressed" ? "uncompressed" : "compressed"
      );
      setAttempts((prev) => prev + 1);
    }
  }, [loadingError, attempts]);

  // Function to retry loading
  const handleRetry = () => {
    setAttempts(0);
    setFileFormat((prev) =>
      prev === "compressed" ? "uncompressed" : "compressed"
    );
  };

  return (
    <div className="unity-container">
      {/* White background overlay that's always visible */}
      <div className="white-background"></div>

      {/* Unity Canvas - completely hidden until fully loaded */}
      {!loadingError && (
        <div
          className={`unity-canvas-wrapper ${canvasVisible ? "loaded" : ""}`}
          style={{
            display: canvasVisible ? "block" : "none", // Completely hide until loaded
          }}
        >
          <Unity
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#ffffff",
            }}
            unityProvider={unityProvider}
          />
        </div>
      )}

      {/* Loading Indicator */}
      {!isLoaded && !loadingError && (
        <div className="loading-overlay">
          <p className="loading-text">
            Loading Unity Content... ({loadingPercentage}%)
          </p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${loadingPercentage}%` }}
            ></div>
          </div>
          <p className="loading-file-info">
            Using {fileFormat} files
            {attempts > 0 ? ` (Attempt ${attempts + 1})` : ""}
          </p>
        </div>
      )}

      {/* Error Indicator */}
      {loadingError && attempts >= 2 && (
        <div className="error-indicator">
          <h3>Error Loading Unity Content</h3>
          <p>{String(loadingError)}</p>

          <div className="troubleshooting-tips">
            <h4>Troubleshooting Tips:</h4>
            <ul>
              <li>
                Check that your Unity build files exist in the correct location
              </li>
              <li>
                Make sure the file names in the component match your actual
                build files
              </li>
              <li>
                For compressed (.br) files, ensure your server is configured to
                serve them properly
              </li>
              <li>
                Try rebuilding your Unity WebGL project with compression
                disabled
              </li>
            </ul>

            <div className="file-check-results">
              <h4>Current Configuration:</h4>
              <p>
                Trying to load {fileFormat} files (Attempt {attempts + 1})
              </p>
              <p>
                Looking for files in: <code>/unity-build/Build/</code>
              </p>
            </div>

            <button onClick={handleRetry} className="retry-button">
              Try Again with{" "}
              {fileFormat === "compressed" ? "Uncompressed" : "Compressed"}{" "}
              Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnityPlayer;

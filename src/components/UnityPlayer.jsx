import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "./UnityPlayer.css"; // Import the CSS for styling

function UnityPlayer() {
  const { unityProvider, isLoaded, loadingProgression, loadingError } =
    useUnityContext({
      // Use relative paths to the files in the public/unity-build folder
      // Adjust these filenames based on your actual Unity build output
      loaderUrl:
        "/unity-build/Build/f2ba0865912f192eb26d6e4186bcdd66.loader.js",
      dataUrl: "/unity-build/Build/11e1b4aba4a6a68646ad26b564cf87bd.data.br",
      frameworkUrl:
        "/unity-build/Build/faf34f3658a59ed5c0341ae9b631b7a0.framework.js.br",
      codeUrl: "/unity-build/Build/1410edb529b39ed01e1329d53fe3ecd5.wasm.br",
    });
  // Calculate loading percentage
  const loadingPercentage = Math.round(loadingProgression * 100);

  return (
    <div className="unity-container">
      {/* Error Indicator */}
      {loadingError && (
        <div className="error-indicator">
          Error loading Unity build: {String(loadingError)}
        </div>
      )}

      {/* Loading Indicator */}
      {!isLoaded && !loadingError && (
        <div className="loading-overlay">
          {" "}
          {/* Changed class name */}
          <p className="loading-text">
            Loading Assets... ({loadingPercentage}%)
          </p>
          {/* Progress Bar Structure */}
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${loadingPercentage}%` }} // Dynamically set width
            ></div>
          </div>
        </div>
      )}

      {/* Unity Canvas */}
      {/* Use a wrapper to help control layout and visibility */}
      <div className={`unity-canvas-wrapper ${isLoaded ? "loaded" : ""}`}>
        <Unity
          style={{
            width: "100%", // Let wrapper control size
            height: "100%",
          }}
          unityProvider={unityProvider}
        />
      </div>
    </div>
  );
}

export default UnityPlayer;

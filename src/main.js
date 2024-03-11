const { app, BrowserWindow } = require("electron");
const path = require("path");

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 1200,
    height: 700,
    minheight: 700,
    center: true,
    darkTheme: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    autoHideMenuBar: true,
    icon: "../images/logo.png",
  });
  const startInternetCheck = () => {
    // Check internet connection status every 5 seconds
    setInterval(() => {
      checkInternetConnection();
    }, 5000);
  };

  const checkInternetConnection = () => {
    const checkUrl = "https://www.google.com";
    const request = require("https").get(checkUrl, (response) => {
      console.log("Internet connection is available");
    });

    request.on("error", () => {
      console.error("Internet connection is not available.");
      mainWindow.webContents.executeJavaScript(
        `alert('Internet connection is disconnected! Please check your internet connection.')`
      );
    });
  };

  mainWindow
    .loadURL("https://lightecfa.up.railway.app/")
    .then(() => {
      console.log("has internet");
      startInternetCheck();
    })
    .catch((error) => {
      console.error("Failed to load URL:", error);
      startInternetCheck();
    });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

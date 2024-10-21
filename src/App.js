import { useState } from "react";
import { Excalidraw, exportToCanvas } from "@excalidraw/excalidraw";


export const App = () => {
    const [canvasUrl, setCanvasUrl] = useState("");
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);

    const saveToLocalStorage = data => localStorage.setItem('appImg', data);

    const previewAction = async function () {
        if (!excalidrawAPI) {
            console.error('no excalidrawAPI found');

            return
        }

        const elements = excalidrawAPI.getSceneElements();
        if (!elements || !elements.length) {
            const errorMsg = 'no scene elements found. Draw something first!';
            console.error(errorMsg);
            alert(errorMsg)

            return
        }

        const canvas = await exportToCanvas({
            elements,
            appState: {
                exportWithDarkMode: false,
            },
            files: excalidrawAPI.getFiles(),
            getDimensions: () => { return { width: 350, height: 350 } }
        });

        const ctx = canvas.getContext("2d");
        ctx.font = "30px Virgil";
        ctx.strokeText("Hardcoded text", 50, 60);

        const base64img = canvas.toDataURL();
        setCanvasUrl(base64img);

        saveToLocalStorage(base64img);
        console.debug('base 64 encoded img is added to localstorage', base64img.substring(0, 50) + '...')
    }

    return (
        <div>
            <div style={{ height: "400px" }}>
                <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} />
            </div>

            <button
                className="custom-button"
                onClick={previewAction}
            >
                Preview
            </button>

            <div className="export export-canvas">
                <img src={canvasUrl} alt="" />
            </div>

        </div>


    )

};


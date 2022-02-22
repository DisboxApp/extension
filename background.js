
chrome.runtime.onInstalled.addListener(async () => {
    console.log('DisboxDownloader extension running and listening for messages');
});

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        if (request) {
            if (request.message) {
                if (request.message.url) {
                    const urlToFetch = request.message.url;
                    fetch(urlToFetch)
                        .then(response => response.blob())
                        .then(blob => {
                            blobToBase64(blob).then(base64 => {
                                sendResponse({ data: base64 });
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    sendResponse({ installed: true });
                }

            }
        }
        return true;
    }
);
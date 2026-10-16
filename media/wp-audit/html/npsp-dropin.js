var createIFrame = function(src, options) {

    options = options || {};

    var iframeVar = document.createElement("iframe");
    iframeVar.setAttribute("id", options.id || 'npspPlusDonateDropIn' + new Date().getTime());
    iframeVar.setAttribute("src", src);
    iframeVar.className = options.className || 'npspPlusDonateDropIn';
    iframeVar.style.border = "0px solid white";
    return iframeVar;
}

var getIFrameSrc = function(donateFormURL){
    var widgetURl = new URL(donateFormURL);

    var redirectURL = new URL(location.href);
    redirectURL.searchParams.delete('session_id');
    redirectURL.searchParams.delete('cancel');
    widgetURl.searchParams.append('redirectURL', redirectURL.href);

    for (let p of new URL(location.href).searchParams) {
        widgetURl.searchParams.append(p[0], p[1]);
    }
    return widgetURl.href;
}

var getContainer = (containerSelector) => {
    containerSelector = containerSelector || 'body';
    return document.querySelector(containerSelector);
}

window.npspPlusDropIn = {

    /*
    {
        donateFormURL: 'https://sandbox-speed-dream-2601-dev-ed-17232fc3661.cs77.force.com/DonateDropIn',
        containerId: '',    // ID of the HTML element the drop-in iFrame will be appended (<body> tag by default).
        iFrameOptions: {
            id: 'npspPlusDonateDropIn',
            className: 'npspPlusDonateDropIn'
        }
    }
     */

    create: function (options) {
        options = options || {};

        return new Promise((resolve, reject) => {

            if(!options.donateFormURL){
                return reject('No donateFormURL param');
            }

            var iFrame = createIFrame(getIFrameSrc(options.donateFormURL), options.iFrameOptions);
            var container = getContainer(options.containerSelector);
            container.appendChild(iFrame);

            window.addEventListener("message", function (e) {
                if (e.data.hasOwnProperty("type")) {
                    if(e.data.type === 'resize'){
                        iFrame.style.height = `${e.data.payload.frameHeight}px`;
                        iFrame.style.width = `${e.data.payload.frameWidth}px`;
                    } else if(e.data.type === 'stripeRedirect') {
                        var stripe = Stripe(e.data.payload.stripePublishableKey);
                        return stripe.redirectToCheckout({
                            sessionId: e.data.payload.sessionId
                        });
                    }
                }
            }, false);

            resolve({
                iFrame: iFrame,
                container: container,
                options: options
            });
        });
    }
}
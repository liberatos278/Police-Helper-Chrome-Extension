let toastIndex = 0;

function notify(title, content, color, type, timeout) {
    let overlayDiv = document.getElementsByClassName('overlay-container')[0];
    let overlayDeleteIndex = 0, toastDeleteIndex = 0;
    let toastDiv = document.getElementById('toast-container');

    if (!overlayDiv) {
        overlayDiv = document.createElement('div');
        overlayDiv.classList.add('overlay-container');

        const body = document.getElementsByTagName('body')[0];
        body.appendChild(overlayDiv);

        overlayDeleteIndex = true;
    }

    if (!toastDiv) {
        overlayDiv.innerHTML = '<div id="toast-container" class="toast-top-right toast-container"></div>';
        toastDeleteIndex = true;
    }

    toastDiv = document.getElementById('toast-container');

    const helperToast = document.createElement('div');
    helperToast.innerHTML =
        `<div style="opacity: 1; background-color: ${color};" toast-component=""
    class="ng-tns-c9-2 ng-star-inserted ng-trigger ng-trigger-flyInOut ngx-toastr">
    <i class='fa fa-${type} fa-2x' style='float: left; margin-top: 6px; margin-left: -30px;'></i>
    <div style="margin-left: 20px;">
    <div class="ng-tns-c9-2 toast-title ng-star-inserted" aria-label="${title}" style=""> ${title}
    </div>
    <div role="alertdialog" aria-live="polite" class="ng-tns-c9-2 toast-message ng-star-inserted"
        aria-label="${content}" style=""> ${content} 
        </div>
        </div>
        <div class="ng-tns-c9-3 ng-star-inserted" style="">
        <div id="toast-${toastIndex}" class="toast-progress ng-tns-c9-3" style="width: 100;"></div>
    </div>
    </div>`;

    $(helperToast).appendTo(toastDiv).hide().fadeIn();
    toastIndex++;

    let width = 100;

    const bar = document.getElementById(`toast-${toastIndex-1}`);
    const progress = setInterval(function () {
        if(width <= 0) {
            clearInterval(progress);

            $(helperToast).fadeOut(function () {
                $(helperToast).remove();
    
                let overlayDiv = document.getElementsByClassName('overlay-container')[0];
                if (overlayDeleteIndex === true && overlayDiv) overlayDiv.remove();
    
                let toastDiv = document.getElementById('toast-container');
                if (toastDeleteIndex === true && toastDiv) toastDiv.remove();
            });
        } else {
            width -= 0.1;
            bar.style.width = width+'%';
        }
    }, 10);
}
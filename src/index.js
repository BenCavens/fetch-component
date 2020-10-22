class ModuleComponent extends HTMLElement {

    static get observedAttributes() {
        return ['src'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'})
    }


    connectedCallback(){
        this.addEventListener('keyup', this._onKeyUp);
    }

    _onKeyUp(){
        console.log('testje');
        this.classList.add('hidden');
    }

    set src(value){
        this.setAttribute('src', value);
    }

    get src(){
        return this.getAttribute('src');
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        console.log('fetching', this.getAttribute('src'));

        fetch(this.getAttribute('src'), {
            method: "GET",
            mode: 'no-cors',
        })
            .then(response => {
                console.log(response);
                return response;
            })
            .then(response => response.text())
            .then(html => {
                this.shadow.innerHTML = html;

                // Trigger script
                const content = new DOMParser().parseFromString(html, 'text/html'),
                    scriptElement = Array.from(content.getElementsByTagName('script'))[0];

                if(scriptElement) {
                    const script = document.createElement('script');
                    script.innerText = scriptElement.textContent;
                    this.shadow.append(script);
                }

            })
            .catch(error => {
                console.warn(error);
            });

        // Load new content
        // this.shadow.innerHTML = '<style> *{ color: tomato; } </style><slot name="header"></slot><strong>'+newValue+'</strong><br><slot></slot>';
    }
}

window.customElements.define('module-component', ModuleComponent);

// ADD dynamically
setTimeout(function(){
    const module = document.createElement('module-component');
    module.src = '/modules/module-one.html';
    document.body.append(module);
}, 1000);
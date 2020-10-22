class ModuleComponent extends HTMLElement {

    static get observedAttributes() {
        return ['src'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'})
    }


    connectedCallback(){
        this.shadow.innerHTML = '<style> *{ color: tomato; } </style><slot name="header"></slot><strong>DIT IS DEN EERSTE INHOUD</strong><br><slot></slot>';

        this.addEventListener('keyup', this._onKeyUp);
    }

    _onKeyUp(){
        this.classList.add('hidden');
    }

    set src(value){
        this.setAttribute('src', value);
    }

    get src(){
        return this.getAttribute('src');
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
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

window.addEventListener('load', function(){
    const module = document.createElement('module-component');
    // module.src = '/modules/module-one.html';
    module.src = '/modules/modules.php';
    document.body.append(module);
})
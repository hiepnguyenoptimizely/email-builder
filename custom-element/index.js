var editor = grapesjs.init({
  container: '#gjs'
});

editor.DomComponents.addType('test-component', {
    model: {
        default: {
            testprop: 1,
        },
        init() {
            console.log('Local hook: model.init');
            this.listenTo(this, 'change:testprop', this.handlePropChange)
        },
        updated(property, value, prevValue) {
            console.log('Local hook: model.updated',
              'property', property, 'value', value, 'prevValue', prevValue);
          },
          removed() {
            console.log('Local hook: model.removed');
          },
          handlePropChange() {
            console.log('The value of testprop', this.get('testprop'));
          }
    },
    view: {
        init() {
            console.log('Local hook: view.init')
        },
        onRender() {
            console.log('Local hook: view.onRender')
        }
    }
})

editor.BlockManager.add('test-component', {
    label: 'Test Component',
    content: '<div data-gjs-type="test-component">Test component</div>'
})

// Global hooks
editor.on(`component:create`, model => console.log('Global hook: component:create', model.get('type')));
editor.on(`component:mount`, model => console.log('Global hook: component:mount', model.get('type')));
editor.on(`component:update:testprop`, model => console.log('Global hook: component:update:testprop', model.get('type')));
editor.on(`component:remove`, model => console.log('Global hook: component:remove', model.get('type')));
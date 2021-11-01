// CustomContextPad.js
export default class CustomContextPad {
    constructor(config, contextPad, create, elementFactory, injector, translate) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        contextPad.registerProvider(this); // 定义这是一个contextPad
    }

    getContextPadEntries(element) {
        const {
            autoPlace,
            create,
            elementFactory,
            translate,
            modeling,
            bpmnFactory
        } = this;

        function appendUserTask(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
                autoPlace.append(element, shape);
            } else {
                appendUserTaskStart(event, element);
            }
        }

        function appendUserTaskStart(event) {
            const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
            create.start(event, shape, element);
        }

        let actions = {};
        actions = {
            'append.user-task': {
                group: 'model',
                className: 'bpmn-icon-user-task',
                title: translate('Append UserTask'),
                action: {
                    click: appendUserTask,
                    dragstart: appendUserTaskStart
                }
            },
        }
        return actions;
    };
}

CustomContextPad.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate'
];
// CustomPalette.js
export default class CustomPalette {
    constructor(bpmnFactory, create, elementFactory, palette, translate) {
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        palette.registerProvider(this);
    }

    // 这个函数就是绘制palette的核心
    getPaletteEntries(element) {
        const {
            bpmnFactory,
            create,
            elementFactory,
            translate
        } = this;

        function createServiceTask(event) {
            const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
            create.start(event, shape);
        }

        return {
            'create.user-task': {
                group: 'activity',
                className: 'bpmn-icon-user-task',
                title: translate('Create UserTask'),
                action: {
                    dragstart: createServiceTask,
                    click: createServiceTask
                }
            },
        };
    }
}

CustomPalette.$inject = [
    'bpmnFactory',
    'create',
    'elementFactory',
    'palette',
    'translate'
];
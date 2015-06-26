module App.Directives {
    export interface ISqDragAndDropDataService {
        addData(data: any): void;
        getData(): any;
        resetData(): void;
    }

    interface ISqDraggableScope extends ng.IScope {
        sqDragData: any;
        sqOnDrag(): any;
    }

    interface ISqDroppableScope extends ng.IScope {
        sqModelData: any;
        sqOnDrop(): any;
    }

    /*
     * Draggable Direktive hier werden die Daten hinterlegt die verschoben werden sollen:
     * ACHTUNG: bei der CallBack Funktion im Attribut "sqOnDrag" KEINE "()" am ende setzen!!
     * Die CallBack funktion hat einen Parameter in dem der Wert übergeben wird der verschoben werden soll
     * function dragStartet(dataToDrag) {}
     * 
     * Optionale Attribute: sq-on-drag -> CallBackfunktion wenn Dragging gestartet wird.
     * 
     * Verwendung: 
     * 
     * <a sq-draggable sq-drag-data="row" sq-on-drag="ctrl.dragStarted" >Drag Data</a>
     */
    export class SqDraggable implements ng.IDirective {
        public restrict = "A";
        //public template = "<span>Test Direktive draggable <span ng-bind='name'></span> </span>";
        public scope = {
            sqDragData: "=",  //Die Daten die verschoben werden sollen
            sqOnDrag: "&"     //Die CallBackFunktion die beim Starten aufgerufen wird, wenn ein Item gedraggt wird.
        }

        constructor(private sqDragAndDropDataService: ISqDragAndDropDataService) {
        }

        public link = ($scope: ISqDraggableScope, element: JQuery, attr: ng.IAttributes) => {
            // this gives us the native JS object
            var el = element[0];
            el.draggable = true;

            //ACHTUNG IE: Wenn man z.B. Drag und Drop auf einem Link verwenden möchte muss zwingend das "href" Attribut enthalten 
            //sein sonst bindet der IE das Event nicht richtig.
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                //e.dataTransfer.setData('text', el.id);
                el.classList.add('sq-drag');
                this.sqDragAndDropDataService.addData($scope.sqDragData);
                $scope.sqOnDrag()($scope.sqDragData);
                return false;
            }, false);

            //Wird aufgerufen wenn das Dragelement irgendwo abgworfen wird aber nicht über einer DropZone
            el.addEventListener('dragend', (e) => {
                el.classList.remove('sq-drag');
                //Die Daten im Service zurücksetzen
                this.sqDragAndDropDataService.resetData();
                return false;
            }, false);
        }

        //#region Angular Module Definition
        private static _module: ng.IModule;
        /**
        * Stellt das aktuelle Angular Modul für den "todoListenService" bereit.
        */
        public static get module(): ng.IModule {
            if (this._module) {
                return this._module;
            }

            //Hier die abhängigen Module für diesen controller definieren, damit brauchen wir von Außen nur den Controller einbinden
            //und müssen seine Abhängkeiten nicht wissen.
            this._module = angular.module('dragAndDropData.directives', []);
            //Da unsere Direktive aus mehreren Definitionen besteht in der Draggable Moduldefinition alle Module definieren
            this._module.directive('sqDraggable', ["SqDragAndDropDataService", (sqDragAndDropDataService) => { return new SqDraggable(sqDragAndDropDataService); }]);
            this._module.directive('sqDroppable', ["SqDragAndDropDataService", (sqDragAndDropDataService) => { return new SqDroppable(sqDragAndDropDataService); }]);
            this._module.service('SqDragAndDropDataService', SqDragAndDropDataService);
            return this._module;
        }
        //#endregion
    }

    /*
     * Droppable Direktive hier kommen die Daten an die verschoben werden sollen zu diesem Zielpunkt.
     * ACHTUNG: bei der CallBack Funktion im Attribut "sqOnDrop" KEINE "()" am ende setzen!!
     * Die CallBack Funktion hat bis zu Zwei Parameter in denen der DropValue und der Aktuelle RowValue übergeben werden, nur wenn auch die sqModelData gesetzt wurden.
     * function dataDropped(sqDragData, sqModelData) {} 
     * 
     * Optionale Attribute:  sq-model-Data -> Die Daten die das Ziel definieren werden dann in der CallBackfunktion mit übergeben
     * 
     * <a sq-droppable sq-model-Data="row" sq-on-drop="ctrl.dataDropped" >Drop Data Here</a>
     */
    export class SqDroppable implements ng.IDirective {
        public restrict = "A";
        public scope: any = {
            sqModelData: '=',  //Die Daten des Feldes bei dem die Werte abgelegt werden, diese werden auch an die onDrop Funktion übergeben
            sqOnDrop: '&'     //Wird aufgerufen wenn der Drag vorgang am Ziel abgelegt wird und es können zwei Parameter in der CallBack Funktion übergeben werden (dragData, dropData)
        }

        constructor(private sqDragAndDropDataService: ISqDragAndDropDataService) {
        }

        public link = ($scope: ISqDroppableScope, element: JQuery, attr: ng.IAttributes) => {
            // das aktuelle Native element ermitteln
            var el = element[0];
            el.addEventListener('dragover', (e) => {
                //Der Stiel des Cursors wenn das Dropitem über dem Ziel erscheint: copy, none, link, move
                //http://html5.komplett.cc/code/chap_global/dropEffect_en.html
                e.dataTransfer.dropEffect = 'move';
                // allows us to drop
                if (e.preventDefault) {
                    e.preventDefault();
                }

                el.classList.add('sq-over');
                return false;
            }, false);

            el.addEventListener('dragenter', (e) => {
                el.classList.add('sq-over');
                return false;
            }, false);

            el.addEventListener('dragleave', (e) => {
                el.classList.remove('sq-over');
                return false;
            }, false);

            el.addEventListener('drop', (e) => {
                // Stops some browsers from redirecting.
                if (e.stopPropagation) {
                    e.stopPropagation();
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                }

                var text = e.dataTransfer.getData('Text');
                el.classList.remove('sq-over');
                var data = this.sqDragAndDropDataService.getData();
                if ($scope.sqModelData !== undefined) {
                    $scope.sqOnDrop()(data, $scope.sqModelData);
                } else {
                    $scope.sqOnDrop()(data);
                }

                return false;
            }, false);
        }
    }

    /*
     * Der Drag And Drop Service der die Daten hält während das Item in der Ui verschoben wird 
     * zum Zielpunkt und am Zielpunkt können die Daten wieder abgerufen werden.
     */
    export class SqDragAndDropDataService implements ISqDragAndDropDataService {
        //static $inject = [];
        private dragData: any;
        constructor() {
            this.init();
        }

        init(): void {
            this.resetData();
        }

        /*
         * Die übergebenen Daten im Service ablegen
         */
        public addData(data: any): void {
            //Da man immer nur einen Drag und Drop Vorgang gleichzeitig ausgühren kann, reicht auch 
            //ein Objekt aus in dem die aktuellen Drag und Drop Daten gespeichert werden.
            this.dragData = data;
        }

        /*
         * Die Daten die im Service gespeichert wurden wieder zurückgeben und 
         * aus dem Service entfernen
         */
        public getData(): any {
            var tempData = this.dragData;
            this.resetData();
            return tempData;
        }

        /*
         * Die Daten im Service zurücksetzen.
         */
        public resetData(): void {
            this.dragData = undefined;
        }
    }

    
    //TODO ControllerAs Syntax
    //TODO draggable="true" von der direktive einfügen
    //TODO Drag and drop aktivieren bzw. deaktivieren
    //TODO Unterschiedliche Drag and DropZone definieren, damit daten nicht zwischen Zonen verschoben werden können die nicht zusammengehören
    //TODO Config Provider in dem wir z.B. die Css Klassen definieren können

    //Quellen:
    //http://www.html5rocks.com/de/tutorials/dnd/basics/#disqus_thread
    //http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html
    //https://jasonturim.wordpress.com/2013/09/01/angularjs-drag-and-drop/
    //https://github.com/codef0rmer/angular-dragdrop/blob/master/src/angular-dragdrop.js

}
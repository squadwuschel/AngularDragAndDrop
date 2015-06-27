module App.Directives {
    export interface ISqDragAndDropDataService {
        addData(data: any, dragAndDropName: string): void;
        getData(dragAndDropName: string): any;
        resetData(): void;
        isSameDragAndDrop(dragAndDropName: string): boolean;
    }

    interface ISqDraggableScope extends ng.IScope {
        sqDragDropName: string;
        sqDragData: any;
        sqAllowDrag: any;
        sqOnDrag(): any;
    }

    interface ISqDroppableScope extends ng.IScope {
        sqDragDropName: string;
        sqModelData: any;
        sqAllowDrop: any;
        sqOnDrop(): any;
    }

    /*
     * Draggable Direktive hier werden die Daten hinterlegt die verschoben werden sollen:
     * ACHTUNG: bei der CallBack Funktion im Attribut "sqOnDrag" KEINE "()" am ende setzen!!
     * Die CallBack funktion hat einen Parameter in dem der Wert übergeben wird der verschoben werden soll
     * function dragStartet(dataToDrag) {}
     * 
     * Optionale Attribute: 
     * sq-on-drag -> CallBackfunktion wenn Dragging gestartet wird.
     * sq-allow-drag -> Boolean True/False gibt an ob das Element wirklich Draggable ist Default: True.
     * sq-drag-drop-name -> String in dem der Name der Drag und Dropzone angeben wird und nur wenn der Name stimmt kann ein Item auf der Zone abgelegt werden. Default: "sqDragAndDrop"
     * 
     * Verwendung: 
     * 
     * <a sq-draggable sq-drag-data="row" sq-on-drag="ctrl.dragStarted" sq-allow-drag="true">Drag Data</a>
     */
    export class SqDraggable implements ng.IDirective {
        public restrict = "A";
        //public template = "<span>Test Direktive draggable <span ng-bind='name'></span> </span>";
        public scope = {
            sqDragData: "=",    //Die Daten die verschoben werden sollen
            sqOnDrag: "&",      //Die CallBackFunktion die beim Starten aufgerufen wird, wenn ein Item gedraggt wird.
            sqAllowDrag: "=",   //Gibt an ob das Element Draggable Aktiviert hat. Optionaler Parameter - Wenn nicht angegeben dann True
            sqDragDropName: "=" //Der Name für die DragZone man kann nur Zwischen den gleichen Dragnamen Items verschieben. Optionaler Parameter - Default: "sqDragAndDrop"
        }

        constructor(private sqDragAndDropDataService: ISqDragAndDropDataService) {
        }

        public link = ($scope: ISqDraggableScope, element: JQuery, attr: ng.IAttributes) => {
            // this gives us the native JS object
            var el = element[0];

            //Prüfen ob das Attribut sqDraggable gesetzt wurde und die draggable Eigenschaft entsprechend setzen.
            if ($scope.sqAllowDrag === undefined || $scope.sqAllowDrag === null) {
                el.draggable = true;
            } else {
                el.draggable = $scope.sqAllowDrag;
                //Wenn kein Drag and Drop Erlaubt sein soll dann auch keine passenden Eventhandler binden.
                if ($scope.sqAllowDrag === false) {
                    return;
                }
            }

            //Prüfen ob ein DragAndDrop Name übergeben wurde
            var dragAndDropZoneName = "sqDragAndDrop";
            if ($scope.sqDragDropName !== undefined && $scope.sqDragDropName !== null) {
                dragAndDropZoneName = $scope.sqDragDropName;
            }

            //ACHTUNG IE: Wenn man z.B. Drag und Drop auf einem Link verwenden möchte muss zwingend das "href" Attribut enthalten 
            //sein sonst bindet der IE das Event nicht richtig.
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                //e.dataTransfer.setData('text', el.id);
                el.classList.add('sq-drag');
                this.sqDragAndDropDataService.addData($scope.sqDragData, dragAndDropZoneName);
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
     * Optionale Attribute:  
     * sq-model-Data -> Die Daten die das Ziel definieren werden dann in der CallBackfunktion mit übergeben
     * sq-allow-drop -> Gibt an ob es erlaubt ist auf diesem Item ein anderes zu Droppen Default: True
     * sq-drag-drop-name -> String in dem der Name der Drag und Dropzone angeben wird und nur wenn der Name stimmt kann ein Item auf der Zone abgelegt werden. Default: "sqDragAndDrop"
     * 
     * <a sq-droppable sq-model-Data="row" sq-on-drop="ctrl.dataDropped" sq-allow-drop="row.allowDrop" >Drop Data Here</a>
     */
    export class SqDroppable implements ng.IDirective {
        public restrict = "A";
        public scope: any = {
            sqModelData: '=',   //Die Daten des Feldes bei dem die Werte abgelegt werden, diese werden auch an die onDrop Funktion übergeben
            sqOnDrop: '&',      //Wird aufgerufen wenn der Drag vorgang am Ziel abgelegt wird und es können zwei Parameter in der CallBack Funktion übergeben werden (dragData, dropData)
            sqAllowDrop: "=",   //Gibt an ob ein Drop von Daten auf dieses Feld erlaubt ist und wenn nicht wird kein Drop Event gebunden. Optionaler Parameter: Default True (Drop erlaubt)
            sqDragDropName: "=" //Der Name für die DragZone man kann nur Zwischen den gleichen Dragnamen Items verschieben. Optionaler Parameter - Default: "sqDragAndDrop"
        }

        constructor(private sqDragAndDropDataService: ISqDragAndDropDataService) {
        }

        public link = ($scope: ISqDroppableScope, element: JQuery, attr: ng.IAttributes) => {
            // das aktuelle Native element ermitteln
            var el = element[0];

            //Sollte sqlAllowDrop angegeben sein und auf False stehen keinen Drop der Daten erlauben!
            if (($scope.sqAllowDrop !== undefined || $scope.sqAllowDrop !== null) && $scope.sqAllowDrop === false) {
                return;
            }

            //Prüfen ob ein DragAndDrop Name übergeben wurde
            var dragAndDropZoneName = "sqDragAndDrop";
            if ($scope.sqDragDropName !== undefined && $scope.sqDragDropName !== null) {
                dragAndDropZoneName = $scope.sqDragDropName;
            }

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

                el.classList.remove('sq-over');
                //Prüfen ob es sich um Daten der selben Drag And Drop Zone handelt und nur nur dann wird auch das DropEvent ausgelöst.
                if (this.sqDragAndDropDataService.isSameDragAndDrop(dragAndDropZoneName)) {
                    //Wir holen uns das aktuelle DragObjekt aus dem DragAndDropService
                    //ACHTUNG wir verschieben oder erstellen hier keine HTML Knoten!
                    var data = this.sqDragAndDropDataService.getData(dragAndDropZoneName);
                    //Wir führen die DropCallBackmethode aus in der die Daten die verschoben wurden zurückgegeben werden.
                    if ($scope.sqModelData !== undefined) {
                        //CallBackMethode aufrufen -> (DropData, ModelDataCurrentDropZone)
                        $scope.sqOnDrop()(data, $scope.sqModelData);
                    } else {
                        //CallBackMethode aufrufen -> (DropData)
                        $scope.sqOnDrop()(data);
                    }
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
        private dragAndDropName: string;
        constructor() {
            this.init();
        }

        init(): void {
            this.resetData();
        }

        /*
         * Die übergebenen Daten im Service ablegen
         */
        public addData(data: any, dragAndDropName: string): void {
            //Da man immer nur einen Drag und Drop Vorgang gleichzeitig ausgühren kann, reicht auch 
            //ein Objekt aus in dem die aktuellen Drag und Drop Daten gespeichert werden.
            this.dragData = data;
            this.dragAndDropName = dragAndDropName;
        }

        /*
         * Die Daten die im Service gespeichert wurden wieder zurückgeben und 
         * aus dem Service entfernen
         */
        public getData(dragAndDropName: string): any {
            if (this.isSameDragAndDrop(dragAndDropName)) {
                var tempData = this.dragData;
                this.resetData();
                return tempData;
            }
            return null;
        }

        /*
         * Die Daten im Service zurücksetzen.
         */
        public resetData(): void {
            this.dragData = undefined;
        }

        /*
         * Prüfen ob der Übergebenen DragAndDropName dem entspricht für den die Daten verschoben wurden.
         */
        isSameDragAndDrop(dragAndDropName: string): boolean {
            return dragAndDropName === this.dragAndDropName;
        }
    }

    
    //TODO ControllerAs Syntax
    //TODO Config Provider in dem wir z.B. die Css Klassen definieren können

    //Quellen:
    //http://www.html5rocks.com/de/tutorials/dnd/basics/#disqus_thread
    //http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html
    //https://jasonturim.wordpress.com/2013/09/01/angularjs-drag-and-drop/
    //https://github.com/codef0rmer/angular-dragdrop/blob/master/src/angular-dragdrop.js

}
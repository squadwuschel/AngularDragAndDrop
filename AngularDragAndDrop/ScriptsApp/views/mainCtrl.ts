﻿module App.Views {
    'use strict';

    export interface IMainCtrl {
        locals: MainCtrlLocals;
        dragStarted(draggedData): void;
        dataDropped(droppedData, currentRowData): void;
    }

    export class MainCtrlLocals {
        name: string;
        items = [
            { name: "johanne", vorname: "test", alter: 12, draggable: false },
            { name: "Willhelm", vorname: "Tell", alter: 16, draggable: false  },
            { name: "Axel", vorname: "Schweiß", alter: 41, draggable: false  },
            { name: "Thomas", vorname: "Hermann", alter: 51, draggable: true  },
            { name: "Sven", vorname: "Schlüter", alter: 25, draggable: true  },
            { name: "Bertram", vorname: "Huber", alter: 54, draggable: true  }
        ];
    }

    export class MainCtrl implements IMainCtrl {
        locals: MainCtrlLocals;
        constructor() {
            this.init();
        }

        init(): void {
            this.locals = new MainCtrlLocals();
            this.locals.name = "Test";
        }

        dragStarted(draggedData): void {
            console.log("Die Daten werden verschoben: " + draggedData);
        }

        dataDropped(droppedData, currentRowData): void {
            console.log("Die Daten wurden verschoben von: " + droppedData.name + ' zum Knoten: ' + currentRowData.name);
        }

        //#region Angular Module Definition
        //Beispiel für Module Implementation: https://github.com/Brocco/ts-star-wars
        private static _module: ng.IModule;
        public static get module(): ng.IModule {
            if (this._module) {
                return this._module;
            }
            this._module = angular.module('mainCtrl', []);
            this._module.controller('mainCtrl', MainCtrl);
            return this._module;
        }
        //#endregion
    }
}
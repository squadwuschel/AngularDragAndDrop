var App;
(function (App) {
    var Views;
    (function (Views) {
        'use strict';
        var MainCtrlLocals = (function () {
            function MainCtrlLocals() {
                this.items = [
                    { name: "johanne", vorname: "test", alter: 12, draggable: false },
                    { name: "Willhelm", vorname: "Tell", alter: 16, draggable: false },
                    { name: "Axel", vorname: "Schweiß", alter: 41, draggable: false },
                    { name: "Thomas", vorname: "Hermann", alter: 51, draggable: true },
                    { name: "Sven", vorname: "Schlüter", alter: 25, draggable: true },
                    { name: "Bertram", vorname: "Huber", alter: 54, draggable: true }
                ];
            }
            return MainCtrlLocals;
        })();
        Views.MainCtrlLocals = MainCtrlLocals;
        var MainCtrl = (function () {
            function MainCtrl() {
                this.init();
            }
            MainCtrl.prototype.init = function () {
                this.locals = new MainCtrlLocals();
                this.locals.name = "Test";
            };
            MainCtrl.prototype.dragStarted = function (draggedData) {
                console.log("Die Daten werden verschoben: " + draggedData);
            };
            MainCtrl.prototype.dataDropped = function (droppedData, currentRowData) {
                console.log("Die Daten wurden verschoben von: " + droppedData.name + ' zum Knoten: ' + currentRowData.name);
            };
            Object.defineProperty(MainCtrl, "module", {
                get: function () {
                    if (this._module) {
                        return this._module;
                    }
                    this._module = angular.module('mainCtrl', []);
                    this._module.controller('mainCtrl', MainCtrl);
                    return this._module;
                },
                enumerable: true,
                configurable: true
            });
            return MainCtrl;
        })();
        Views.MainCtrl = MainCtrl;
    })(Views = App.Views || (App.Views = {}));
})(App || (App = {}));

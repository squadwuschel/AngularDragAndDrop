module App {
    export class MainApp {
        static createApp(angular: ng.IAngularStatic) {
            //Alle Module definieren die wir verwenden.
            angular.module("app.main", [
                //Fremdanbieter Module
                //Module die mit TypeScript geschrieben wurden einbinden
            ]);
        }

        //Alternative Methode zum initialisieren
        //private static _module: ng.IModule;
        //public static createModule(ng: ng.IAngularStatic): ng.IModule {
        //    if (this._module) {
        //        return this._module;
        //    }
        //    this._module = ng.module('mainApp', [MainAppCtrl.module.name]);
        //    return this._module;  
        //}
    }
}

//Unsere Anwendung intial aufrufen/starten
App.MainApp.createApp(angular);


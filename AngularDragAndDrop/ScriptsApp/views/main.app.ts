module App {
    export class MainApp {
        static createApp(angular: ng.IAngularStatic) {
            //Alle Module definieren die wir verwenden.
            angular.module("app.main", [
                App.Views.MainCtrl.module.name,
                App.Directives.SqDraggable.module.name
            ]);
        }
    }
}

//Unsere Anwendung intial aufrufen/starten
App.MainApp.createApp(angular);


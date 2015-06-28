module App {
    export class MainApp {
        static createApp(angular: ng.IAngularStatic) {
            //Alle Module definieren die wir verwenden.
            angular.module("app.main", [
                App.Views.MainCtrl.module.name,
                App.Directives.SqDraggable.module.name
            ])
                //Per Config die passenden DragAndDrop Provider Css Klassen setzen.
                .config(["dragAndDropConfigProvider", (dragAndDropConfigProvider: Directives.IDragAndDropServiceProvider) => {
                    dragAndDropConfigProvider.config.dragstartCss = "btn-info";
                }
            ]);
        }
    }
}

//Unsere Anwendung intial aufrufen/starten
App.MainApp.createApp(angular);


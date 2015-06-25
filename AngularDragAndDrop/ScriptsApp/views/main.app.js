var App;
(function (App) {
    var MainApp = (function () {
        function MainApp() {
        }
        MainApp.createApp = function (angular) {
            //Alle Module definieren die wir verwenden.
            angular.module("app.main", [
                App.Views.MainCtrl.module.name,
                App.Directives.SqDraggable.module.name
            ]);
        };
        return MainApp;
    })();
    App.MainApp = MainApp;
})(App || (App = {}));
//Unsere Anwendung intial aufrufen/starten
App.MainApp.createApp(angular);
//# sourceMappingURL=main.app.js.map
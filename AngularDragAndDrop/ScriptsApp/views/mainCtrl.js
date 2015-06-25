var App;
(function (App) {
    var MainApp = (function () {
        function MainApp() {
        }
        MainApp.createApp = function (angular) {
            //Alle Module definieren die wir verwenden.
            angular.module("app.main", [
            ]);
        };
        return MainApp;
    })();
    App.MainApp = MainApp;
})(App || (App = {}));
//Unsere Anwendung intial aufrufen/starten
App.MainApp.createApp(angular);
//Stackoverflow Post zur Frage wie man eine App am besten initialisiert
//http://stackoverflow.com/questions/29545246/how-to-initialize-angularjs-app-with-typescript
//Wenn wir die TypeScript Compilierung verwenden in der alle Ts Scripte in eine Datei compiliert werden, dann muss
//eine "_references.ts" Datei im Root des Projektes liegen und enthält alle Abhängigkeiten inkl. 
//der passenden Reihenfolge damit TS weiß welche Datei von welcher abhängt und alle in der richtigen Reihenfolge compiliert werden
//und damit am Ende auch alle Abhängigkeiten gefunden werden. - ACHTUNG ich hatte hier einige Probleme mit der richtigen Reihenfolge, daher
//verwende ich die Bundles von .NET 
//# sourceMappingURL=mainCtrl.js.map
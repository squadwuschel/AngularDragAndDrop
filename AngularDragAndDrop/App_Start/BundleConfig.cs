using System.Web;
using System.Web.Optimization;

namespace AngularDragAndDrop
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/jquery-1.9.1.js",
                        "~/Scripts/angular.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                      //  "",
                        ));

            bundles.Add(new StyleBundle("~/Content/styles").Include(
                "~/Content/bootstrap.css",
                "~/Content/css/font-awesome.css",
                "~/Content/myCustomStyles.css"
            ));
        }
    }
}
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.profly",{},{init:function(e,a,t){this._super(e,a,t),this.loadTemplates({"project-filespreview-wrapper":bizagi.getTemplate("bizagi.workportal.desktop.widget.profly").concat("#project-filespreview-wrapper")})},renderContent:function(){var e=this,a={paramsURL:""};e.params.data&&e.params.data.route&&e.params.data.params.id&&(a.paramsURL=encodeURI("?route="+e.params.data.route+"&id="+e.params.data.params.id+"&displayName="+e.params.data.params.displayName)),e.params.data&&e.params.data.route&&e.params.data.params.module&&(a.paramsURL=encodeURI("?route="+e.params.data.route+"&module="+e.params.data.params.module));var t=e.getTemplate("project-filespreview-wrapper");return e.content=t.render(a),bizagi.util.isIE11OrLower()&&(localStorage.setItem("params_profly",a.paramsURL),$(e.content).css({width:"0px",height:"0px"}),$.when(e.reloadToDashboardWhenLoadIFrame()).done(function(){$(e.content).css("width","100%").css("height","100%")})),bizagi.util.isChrome()&&$(e.content).on("load",function(e){-1===e.currentTarget.contentWindow.location.href.indexOf("quickprocess")&&location.reload()}),e.content},reloadToDashboardWhenLoadIFrame:function(){var e=$.Deferred();return function a(){document.getElementById("iframe-liveprocesses")&&void 0!==document.getElementById("iframe-liveprocesses").contentDocument?(document.getElementById("iframe-liveprocesses").contentDocument.location="./jquery/quickprocess/dist/",setTimeout(function(){e.resolve()},1e3)):setTimeout(a,50)}(),e.promise()},postRender:function(){},clean:function(){var e=this;$("#iframe-liveprocesses",e.content).off(),e.plugins={},e.form={},e.currentFile={},e.filesNumber=0}}),bizagi.injector.register("bizagi.workportal.widgets.profly",["workportalFacade","dataService",bizagi.workportal.widgets.profly]);
//# sourceMappingURL=../../../../Maps/desktop/proflyangular2.production.js.map
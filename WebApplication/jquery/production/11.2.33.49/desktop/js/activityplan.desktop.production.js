bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.dashboard.menu.activity.plan",{},{init:function(e,t,i){var a=this;a.params=i||{},a._super(e,t,i),a.loadTemplates({"project-dashboard-menu":bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.dashboard.menu.activity.plan").concat("#project-dashboard-menu2")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){var e=this;e.params.contextsLeftSidebarCaseDashboard.forEach(function(t){e.sub(t,$.proxy(e.updateView,e))})},updateView:function(e,t){var i=this;i.params=$.extend(i.params,t.args),i.clean();var a=i.getContent().empty(),r={showFormOverview:i.params.menuDashboard.showFormOverview,showFormActivity:i.params.menuDashboard.showFormActivity,showCommentsOptionMenu:i.params.menuDashboard.showCommentsOptionMenu,showFilesOptionMenu:i.params.menuDashboard.showFilesOptionMenu,showTimeLineOptionMenu:i.params.menuDashboard.showTimeLineOptionMenu,showPlanOptionMenu:i.params.menuDashboard.showPlanOptionMenu,contextPlanOptionMenu:i.params.menuDashboard.contextPlanOptionMenu,contextFormActivityOptionMenu:i.params.menuDashboard.contextFormActivityOptionMenu,contextualized:i.params.plan.contextualized};i.getTemplate("project-dashboard-menu").render(r).appendTo(a),i.params.showContextByMenuDashboard&&$("li[data-context='"+e.type.toUpperCase()+"']",i.content).addClass("active").siblings().removeClass("active"),i.handlerEvents();var n={idPlan:i.params.plan.id};$.when(i.callGetPlan(n)).then(function(e){$.extend(i.params.plan,e),i.pub("notify",{type:"LOAD_INFO_PLAN",args:i.params})})},loadContentById:function(e){var t=this;e.preventDefault();var i=$(e.target).closest("li");i.hasClass("active")||$.when(bizagi.util.autoSave()).done(function(){$(document).data("auto-save","");var e=i.data("context");if(e){var a=t.pub("notify",{type:"NAVIGATOR_GETLEVEL"}),r=parseInt(a[0]);t.params.refreshLastItemBreadcrumb=!1,t.pub("notify",{type:e.toUpperCase(),args:$.extend(t.params,{showContextByMenuDashboard:e,histName:"",level:r})}),$("li[data-context='"+t.params.showContextByMenuDashboard.toUpperCase()+"']",t.content).addClass("active").siblings().removeClass("active")}})},callGetPlan:function(e){var t=$.Deferred();return this.dataService.getPlan(e).always(function(e){200===e.status||201===e.status||void 0===e.status?t.resolve(e):t.reject()}),t.promise()},subMenuHandler:function(){var e=this.getContent(),t=$("[data-context='ACTIVITYPLANCOMMENTS']",e),i=$("[data-context='ACTIVITYPLANFILES']",e),a=$("[data-context='ACTIVITYPLANTIMELINE']",e);$(".ui-bizagi-wp-project-tab-submenu a",e).on("click",function(){t.toggle(),i.toggle(),a.toggle()})},handlerEvents:function(){var e=this,t=e.getContent();e.subMenuHandler(),$(".ui-bizagi-wp-project-tab-links a",t).on("click",$.proxy(e.loadContentById,e))},clean:function(){var e=this,t=e.getContent();e.params&&e.params.contextsLeftSidebarCaseDashboard&&e.params.contextsLeftSidebarCaseDashboard.forEach(function(t){e.unsub(t,$.proxy(e.updateView,e))}),$(".ui-bizagi-wp-project-tab-links a",t).off()}}),bizagi.injector.register("bizagi.workportal.widgets.project.dashboard.menu.activity.plan",["workportalFacade","dataService",bizagi.workportal.widgets.project.dashboard.menu.activity.plan],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.content.dashboard",{},{init:function(e,t,i){this._super(e,t,i),this.loadTemplates({"project-content-dashboard":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.content.dashboard").concat("#project-plan-content-dashboard")})},renderContent:function(){var e=this,t=e.getTemplate("project-content-dashboard");return e.content=t.render({}),e.content},postRender:function(){setTimeout(function(){$(window).trigger("resize")},1e3)}}),bizagi.injector.register("bizagi.workportal.widgets.project.content.dashboard",["workportalFacade","dataService",bizagi.workportal.widgets.project.content.dashboard],!0),bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.activity",{},{init:function(e,t,i){this._super(e,t,i),this.loadTemplates({"project-activity":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.activity").concat("#project-activity-wrapper")})},renderContent:function(){var e=this,t=e.getTemplate("project-activity");return e.content=t.render({}),e.content},postRender:function(){var e=this;e.renderForm({idCase:e.params.idCase,idWorkitem:e.params.idWorkitem,idTask:e.params.idTask,radNumber:e.params.radNumber,withOutGlobalForm:e.params.withOutGlobalForm||!1,isClosed:e.params.isClosed,belongCurrentUser:e.params.belongCurrentUser,hasGlobalForm:bizagi.util.parseBoolean(e.params.hasGlobalForm),showForm:bizagi.util.parseBoolean(e.params.showForm),isOfflineForm:e.params.isOfflineForm||!1,messageForm:e.params.messageForm||""})},renderForm:function(e){var t=this,i=t.getContent(),a=!e.isClosed&&!e.belongCurrentUser;if(a&&(a=!0,e.hasGlobalForm||(e.withOutGlobalForm=!0)),e.withOutGlobalForm){var r=t.workportalFacade.getTemplate("info-message"),n=""!==e.messageForm?e.messageForm:t.resources.getResource("render-without-globalform");void 0!==t.params&&void 0!==t.params.isOfflineForm&&1==t.params.isOfflineForm&&(n=bizagi.util.getMessageFromNetworkState(t.dataService.online));var o=$.tmpl(r,{message:n});o.appendTo(i),t.goToInbox(o),$.Deferred().fail()}else{var s=null!=typeof t.dataService.serviceLocator.proxyPrefix?t.dataService.serviceLocator.proxyPrefix:"",p=null!=typeof t.dataService.database?t.dataService.database:"",c=t.rendering=new bizagi.rendering.facade({proxyPrefix:s,database:p});bizagi.util.setContext(e),t.rendering.subscribe("onLoadDataItemsFromFormActivityPlan",function(e,i){t.pub("notify",{type:"UPDATE_ITEMS_FROM_FORMRENDER",args:i})}),t.rendering.subscribe("rendering-formRendered",function(e,i){t.pub("notify",{type:"ON_RENDER_FINISH",args:i})});c.execute($.extend(e,{canvas:i,menu:t.menu}));i.bind("routing",function(e,i){var a={action:bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,idCase:t.params.idCase,fromTask:t.params.fromTask||t.params.idTask,fromWorkItemId:t.params.fromWorkItemId||t.params.idWorkitem,isOfflineForm:t.params.isOfflineForm,formsRenderVersion:t.params.formsRenderVersion,onClose:function(){t.publish("changeWidget",{widgetName:bizagi.cookie("bizagiDefaultWidget")})}};a=$.extend(a,i),t.publish("executeAction",a)})}t.renderingFacade=c,t.resizeLayout()},goToInbox:function(e){var t=this;$("#ui-bizagi-btn-go-to-inbox",e).click(function(){t.publish("changeWidget",{widgetName:t.workportalFacade.workportal.getWidgetByCookie(!0)})})},clean:function(){}}),bizagi.injector.register("bizagi.workportal.widgets.project.activity",["workportalFacade","dataService",bizagi.workportal.widgets.project.activity],!0),bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.activity.sidebar",{},{init:function(e,t,i,a){this._super(e,t,a),this.serviceloadDataPlan=i,this.loadTemplates({"project-plan-activity-sidebar":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.sidebar").concat("#project-plan-activity-sidebar")})},renderContent:function(){var e=this.getTemplate("project-plan-activity-sidebar");return this.content=e.render({}),this.content},postRender:function(){this.sub("LOAD_INFO_PLAN",$.proxy(this.onNotifyLoadInfoPlan,this))},onNotifyLoadInfoPlan:function(e,t){var i=this;if(i.params.plan.idActivitySelected){var a={idPlan:i.params.plan.id};i.serviceloadDataPlan.loadData(a,i.getDateServer,i.params),i.serviceloadDataPlan.subscribe("loadedWithDataActivities",$.proxy(i.loadedWithDataActivities,i)),i.serviceloadDataPlan.subscribe("loadedWithDataFirstParent",$.proxy(i.loadedWithDataFirstParent,i))}else"ACTIVITYPLANPROCESSMAP"!==i.params.showContextByMenuDashboard&&"ACTIVITYPLANLOG"!==i.params.showContextByMenuDashboard||i.pub("notify",{type:"DISABLED_RIGHT_SIDEBAR"})},loadedWithDataActivities:function(){var e=this;e.pub("notify",{type:"LOADED_ACTIVITIES_PLAN",args:e.params}),e.pub("notify",{type:"LOAD_INFO_SUMMARY_PROGRESS_PLAN",args:e.params}),e.pub("notify",{type:"LOAD_INFO_ACTIVITY_SUMMARY",args:e.params}),e.pub("notify",{type:"LOAD_INFO_ACTIVITIES_PLAN",args:e.params})},loadedWithDataFirstParent:function(){this.pub("notify",{type:"LOAD_INFO_SUMMARY_PLAN",args:this.params})},clean:function(){var e=this;e.serviceloadDataPlan&&(e.serviceloadDataPlan.unsubscribe("loadedWithDataActivities",$.proxy(e.loadedWithDataActivities,e)),e.serviceloadDataPlan.unsubscribe("loadedWithDataFirstParent",$.proxy(e.loadedWithDataFirstParent,e)))}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.sidebar",["workportalFacade","dataService","bizagi.workportal.services.behaviors.loadDataPlan",bizagi.workportal.widgets.project.plan.activity.sidebar],!0),bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.activity.action",{},{init:function(e,t,i,a){var r=this;r._super(e,t,a),r.dateFormat=bizagi.localization.getResource("dateFormat"),r.timeFormat=bizagi.localization.getResource("timeFormat"),r.estimatedFinishDateTime,r.beforeUserAssignedActivity="",r.notifier=i,r.loadTemplates({"activity-action-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.action").concat("#project-plan-activity-action"),"activity-action-editionpopup":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.action").concat("#project-plan-activity-action-editionpopup")}),r.dialogBox={}},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){var e=this;e.sub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(e.onNotifyLoadInfoActivityExecution,e)),e.sub("EXPANDED_RIGHT_SIDEBAR",$.proxy(e.onNotifyExpandedRightSidebar,e))},onNotifyLoadInfoActivityExecution:function(e,t){var i=this;i.params=$.extend(i.params,t.args);var a=i.getContent().empty(),r={};if(i.params.plan.idActivitySelected&&(r=i.params.plan.activities.filter(function(e){return e.id.toUpperCase()===i.params.plan.idActivitySelected.toUpperCase()})[0]),i.params.plan.idUserCreator===bizagi.currentUser.idUser||r.userAssigned==bizagi.currentUser.idUser){var n={};n.currentActivityName=r.name,n.showEditAction=!0,i.params.plan.idUserCreator!==bizagi.currentUser.idUser&&(n.showEditAction=!1);var o=i.getTemplate("activity-action-main");a.append(o.render(n)),n.showEditAction&&(i.initilizeActionMenu(),i.beforeUserAssignedActivity=r.userAssigned,i.content.append(a),i.initializeTempleteAndEvents())}},initializeTempleteAndEvents:function(){var e=this;e.plugins={},e.plugins.activityEdition=e.initPluginPopupEdition(),e.formEditActivity={assignee:$("#activity-form-assignee",e.plugins.activityEdition),date:$("#activity-form-date",e.plugins.activityEdition),duration:$("#activity-form-duration",e.plugins.activityEdition),buttonCancel:$("#ui-bizagi-wp-project-popupform-action-cancel",e.plugins.activityEdition),buttonUpdate:$("#ui-bizagi-wp-project-popupform-action-update",e.plugins.activityEdition)},e.formEditActivity.buttonCancel.on("click",$.proxy(e.onClickPopupButtonCancel,e)),e.formEditActivity.buttonUpdate.on("click",$.proxy(e.onClickPopupButtonUpdate,e)),e.formEditActivity.date.on("keydown",$.proxy(e.onDeleteDate,e)),e.formEditActivity.duration.on("keyup",$.proxy(e.onTypeDuration,e))},onNotifyExpandedRightSidebar:function(){this.initilizeActionMenu()},initilizeActionMenu:function(){$("#ui-bizagi-wp-project-plan-activity-action .menu",this.content).menu({select:$.proxy(this.onSelectMenu,this)}).removeClass("ui-widget-content")},initPluginPopupEdition:function(){var e=this.getTemplate("activity-action-editionpopup");return this.dialogBox.formContent=e.render({}),this.dialogBox.formContent},initializeAutoComplete:function(e){var t=this,i=t.dataService.serviceLocator.getUrl("admin-getUsersList");e.autocomplete({minLength:2,source:function(e,t){$.ajax({url:i,data:{domain:"",userName:"",fullName:e.term,organization:"",pag:1,pagSize:100,orderField:"fullName"},success:function(e){t($.map(e.users,function(e){return{label:e.user,value:e.idUser}}))}})},select:function(i,a){var r=a.item.label;return e.val(r),t.formEditActivity.IdAssignee=a.item.value,!1},focus:function(){return!1},change:function(e,i){return null===i.item&&(t.formEditActivity.IdAssignee=null,t.formEditActivity.assignee.val("")),!1}})},initializeDatePicker:function(e){var t=this;e.datepicker({onSelect:function(){t.formEditActivity.duration.val(""),t.estimatedFinishDateTime=t.formEditActivity.date.datepicker("getDate")?t.formEditActivity.date.datepicker("getDate").getTime():void 0}}),e.datepicker("option","dateFormat",bizagi.util.dateFormatter.getDateFormatByDatePickerJqueryUI())},initializeSpiner:function(e){var t=this;function i(e,i){var a=i||$(e.target).val();bizagi.util.isNumeric(a)&&parseInt(a,10)>0?(t.formEditActivity.date.val(""),t.estimatedFinishDateTime=void 0):$(e.target).val("")}e.spinner({min:1,max:1e3,placeHolder:bizagi.localization.getResource("workportal-hours"),change:function(e){i(e)},spin:function(e,t){i(e,t.value)}})},onDeleteDate:function(e){8===e.keyCode&&($(e.target).val(""),this.fieldDurationActive(!0))},onTypeDuration:function(e){""!==$(e.target).val()?this.estimatedFinishDateTime=void 0:this.activateElement(this.form.date)},onSelectMenu:function(e,t){if(0===$(e.currentTarget).find("i").length)switch($(t.item).data("item")){case"edit":this.onClickOpenPopupEdition()}},onClickOpenPopupEdition:function(){var e=this;e.initializeTempleteAndEvents(),e.dialogBox.formContent.dialog({resizable:!1,draggable:!1,height:"auto",width:"600px",modal:!0,title:bizagi.localization.getResource("workportal-project-plan-title-activity-properties"),maximize:!0,open:$.proxy(e.onOpenPopupEdition,e),close:$.proxy(e.onClosePopupEdition,e)})},onOpenPopupEdition:function(){var e=this,t=e.params.plan.activities.filter(function(t){return t.id.toUpperCase()===e.params.plan.idActivitySelected.toUpperCase()})[0],i=t&&!bizagi.util.isEmpty(t.estimatedFinishDate)?t.estimatedFinishDate:"";isNaN(i)||(i=bizagi.util.dateFormatter.formatInvariant(new Date(i)));var a=i?bizagi.util.dateFormatter.getDateFromInvariant(i):"",r=a instanceof Date&&a.getTime()<e.getDateServer();e.initializeAutoComplete(e.formEditActivity.assignee),e.initializeDatePicker(e.formEditActivity.date),e.initializeSpiner(e.formEditActivity.duration),t.userAssigned&&e.setUserAssignedById(t.userAssigned),e.formEditActivity.date.datepicker("option","minDate",new Date(e.getDateServer())),t.estimatedFinishDate&&r&&e.formEditActivity.date.datepicker("option","minDate",a),t.estimatedFinishDate&&(a&&e.formEditActivity.date.datepicker("setDate",a),e.estimatedFinishDateTime=t.estimatedFinishDate),t.duration&&e.formEditActivity.duration.val(parseInt(t.duration,10))},onClosePopupEdition:function(){this.removePopupWidgets()},setUserAssignedById:function(e){var t=this;t.callGetDataUsers(e).then(function(e){t.formEditActivity.assignee.val(e[0].name)}),t.formEditActivity.IdAssignee=e},onClickPopupButtonCancel:function(e){e.preventDefault(),this.removePopupWidgets()},removePopupWidgets:function(){this.formEditActivity.assignee.next().find("span").html(""),this.dialogBox.formContent.remove(),$("#ui-datepicker-div").remove()},onClickPopupButtonUpdate:function(){var e=this;if(e.validateParamsOfFormEditActivity()){var t=e.params.plan.activities.filter(function(t){return t.id.toUpperCase()===e.params.plan.idActivitySelected.toUpperCase()})[0],i=e.formEditActivity.IdAssignee||bizagi.currentUser.idUser;""!=e.formEditActivity.duration.val()&&(e.params.plan.activities.filter(function(t){return t.id.toUpperCase()===e.params.plan.idActivitySelected.toUpperCase()})[0].estimatedFinishDate="");var a={progress:t.progress,id:t.id,startDate:t.startDate,duration:e.formEditActivity.duration.val(),userAssigned:i,allowEdition:t.allowEdition,description:t.description,name:t.name,idPlan:t.idPlan,estimatedFinishDate:e.estimatedFinishDateTime,finishDate:t.finishDate,items:t.items};$.when(e.dataService.editActivityPlan(a)).done(function(){t=$.extend(t,a),e.removePopupWidgets(),e.beforeUserAssignedActivity!==e.formEditActivity.IdAssignee?e.pub("notify",{type:"ACTIVITYPLANCOMMENTS",args:$.extend(e.params,{refreshAllWidgets:!0})}):e.pub("notify",{type:e.params.showContextByMenuDashboard,args:e.params}),e.removePopupWidgets(),e.notifier.showSucessMessage(bizagi.localization.getResource("workportal-project-plan-activity-update-message"))})}},onClickFavorite:function(e){e.preventDefault();var t=this,i={};$(e.target).hasClass("bz-icon-star-outline")?(i={idObject:t.params.idCase,favoriteType:"CASES"},$.when(t.dataService.addFavorite(i)).done(function(i){t.params.guidFavorite=i.idFavorites,$(e.target).removeClass("bz-icon-star-outline"),$(e.target).addClass("bz-icon-star")})):(i={idObject:t.params.guidFavorite,favoriteType:"CASES"},$.when(t.dataService.delFavorite(i)).done(function(){$(e.target).addClass("bz-icon-star-outline"),$(e.target).removeClass("bz-icon-star")}))},clean:function(){var e=this;e.unsub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(e.onNotifyLoadInfoActivityExecution,e)),e.unsub("EXPANDED_RIGHT_SIDEBAR",$.proxy(e.onNotifyExpandedRightSidebar,e))},validateParamsOfFormEditActivity:function(){var e=this.formEditActivity.assignee;if(e.val()&&""!==e.val()&&this.formEditActivity.IdAssignee)return!0;var t=bizagi.localization.getResource("workportal-general-error-field-required");return t=t.replace("{0}",bizagi.localization.getResource("workportal-project-plan-assignee").toLowerCase()),e.next().find("span").html(t),!1},callGetDataUsers:function(e){var t=$.Deferred(),i={userIds:e,width:50,height:50};return this.dataService.getUsersData(i).always(function(e){t.resolve(e)}),t.promise()}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.action",["workportalFacade","dataService","notifier",bizagi.workportal.widgets.project.plan.activity.action]),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.time",{},{init:function(e,t,i){var a=this;a._super(e,t,i),a.EXECUTING_ACTIVITY="EXECUTING",a.FINISHED_ACTIVITY="FINISHED",a.datePickerRegional=bizagi.localization.getResource("datePickerRegional"),a.loadTemplates({"plan-time-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.time").concat("#project-plan-activity-time")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){this.sub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(this.onNotifyLoadInfoActivitySummary,this))},onNotifyLoadInfoActivitySummary:function(e,t){var i=this;i.params=$.extend(i.params,t.args),i.getContent().empty();var a=i.params.plan.activities.filter(function(e){return e.id===i.params.plan.idActivitySelected})[0];if(a.startDate){i.getStateActivity(a);var r={time:{fromDate:i.getFormattedDate(new Date(i.getFirstDate(a)))}},n=i.getDataByScenarios(a,!0);$.when(n.unitTime).done(function(e){n=$.extend(n,{unitTime:e}),i.updateWidget($.extend(r.time,n))})}},updateWidget:function(e){var t=this.getContent().empty(),i=this.getTemplate("plan-time-main"),a=bizagi.util.dateFormatter.getRelativeTime(new Date(Date.now()-60*e.unitTime.minutes*1e3),null,!1),r=bizagi.localization.getResource("workportal-project-activity-state-"+e.keywordResource);e.messageTime=r.replace("%s",a),i.render(e).appendTo(t);var n=$(".remaining-days .time-remaining",t),o=$(".remaining-days .days",t).width();n.css("padding-left",(o+7).toString()+"px"),$(".remaining-days .bar-completed",t).css("width",e.percentBar+"%")},getStateActivity:function(e){return e.finishDate?(e.currentState=this.FINISHED_ACTIVITY,this.FINISHED_ACTIVITY):(e.currentState=this.EXECUTING_ACTIVITY,this.EXECUTING_ACTIVITY)},getFirstDate:function(e){return e.currentState===this.EXECUTING_ACTIVITY?e.startDate:e.finishDate},getDataByScenarios:function(e){var t=this,i={colorBar:null,percentBar:100,keywordResource:null,unitTime:null},a={};switch(e.currentState){case t.EXECUTING_ACTIVITY:i.keywordResource="opened",i.colorBar=t.getColorByCreatedAndEstimatedDate(e),a={idUser:bizagi.currentUser.idUser,fromDate:e.startDate,toDate:Date.now()},i.unitTime=t.callGetEffectiveDuration(a);break;case t.FINISHED_ACTIVITY:i.colorBar="Gray",i.keywordResource="closed",a={idUser:bizagi.currentUser.idUser,fromDate:e.finishDate,toDate:Date.now()},i.unitTime=t.callGetEffectiveDuration(a)}return i},getColorBar:function(e){return this.getDataByScenarios(e).colorBar},getPercentBar:function(e){return this.getDataByScenarios(e).percentBar},getKeywordResourceDescriptionBar:function(e){return this.getDataByScenarios(e).keywordResource},getUnitTime:function(e){return this.getDataByScenarios(e).unitTime},getColorByCreatedAndEstimatedDate:function(e){var t="Red";e.estimatedFinishDate&&(Date.now()<e.estimatedFinishDate&&(t=(new Date).getUTCDate()===new Date(e.estimatedFinishDate).getUTCDate()?"Yellow":"Green"));return t},getFormattedDate:function(e){return this.datePickerRegional.monthNames[e.getMonth()]+" "+bizagi.util.dateFormatter.formatDate(e,"dd hh:mm tt",bizagi.localization.getResource("datePickerRegional"))},callGetEffectiveDuration:function(e){var t=$.Deferred();return $.when(this.dataService.getEffectiveDuration(e)).done(function(e){t.resolve(e)}),t.promise()}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.time",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.activity.time],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.progress",{},{init:function(e,t,i){this._super(e,t,i),this.plugins={},this.dialogBox={},this.loadTemplates({"plan-progress-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.progress").concat("#project-plan-activity-progress"),"plan-progress-popup-edit":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.progress").concat("#project-plan-activity-edit-progress")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){var e=this;e.sub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(e.onNotifyLoadInfoActivityExecution,e)),e.sub("UPDATE_ITEMS_FROM_FORMRENDER",$.proxy(e.onNotifyUpdateItemFromRender,e))},onNotifyLoadInfoActivityExecution:function(e,t){var i=this;i.params=$.extend(i.params,t.args);var a=i.getContent().empty(),r=i.params.plan.activities.filter(function(e){return e.id.toUpperCase()==i.params.plan.idActivitySelected.toUpperCase()})[0],n={valuePercentBarComplete:0};n.progress={progress:r.progress,canEdit:0===r.items.length},n.progress.progress&&(n.valuePercentBarComplete=n.progress.progress),i.getTemplate("plan-progress-main").render(n).appendTo(a),i.plugins.popupEditProgress=i.initPluginPopupEditProgress();var o=i.plugins.popupEditProgress;i.formEditProgress={sliderProgress:$("#sliderProgress",o).slider({orientation:"horizontal",range:"min",max:100,width:100,from:5,to:50,step:1,value:n.valuePercentBarComplete,slide:$.proxy(i.onChangesliderProgress,i),change:$.proxy(i.onChangesliderProgress,i)}).each(function(){for(var e=$(this).slider("option","max")-$(this).slider("option","min"),t=0;t<=e;t+=10){var i=$("<label class='step'>"+t+"</label>").css("left",t/e*100+"%");$(this).append(i)}}),numericTextBoxPlugin:$("#inputProgressNumericTextBox",o).spinner({format:"n0",min:0,max:100,spin:$.proxy(i.onChangeNumericTextBoxProgress,i),change:$.proxy(i.onChangeNumericTextBoxProgress,i),value:n.valuePercentBarComplete,decimals:0}),buttonChangeProgress:$("#button-accept-change-progress",o),buttonCancel:$("#button-cancel-change-progress",o)},$(".action-open-popup-edit-progress",a).on("click",$.proxy(i.onShowPopupEditProgress,i)),i.formEditProgress.buttonCancel.on("click",$.proxy(i.onClickCancel,i)),i.formEditProgress.buttonChangeProgress.on("click",$.proxy(i.onSubmitFormChangeProgress,i)),i.updateProgressUI(n.valuePercentBarComplete),i.formEditProgress.numericTextBoxPlugin.spinner("value",n.valuePercentBarComplete)},onNotifyUpdateItemFromRender:function(e,t){var i=t.args.items,a=t.args.activityWork;i.length>0?$(".action-open-popup-edit-progress",this.content).hide():$(".action-open-popup-edit-progress",this.content).show(),$(".bz-wp-timestamp span",this.content).text(a),$(".bz-wp-progress-bar",this.content).css("width",a+"%")},updateProgressUI:function(e){var t=this.getContent();$(".bz-wp-timestamp span",t).text(e);var i=$(".remaining-days .time-remaining",t),a=$(".remaining-days .days",t).width();i.css("padding-left",(a+7).toString()+"px"),$(".remaining-days .bar-completed",t).css("width",e.toString()+"%")},initPluginPopupEditProgress:function(){var e=this.getTemplate("plan-progress-popup-edit");return this.dialogBox.formContent=e.render(),this.dialogBox.formContent},onShowPopupEditProgress:function(){var e=this;e.dialogBox.formContent.dialog({resizable:!1,draggable:!1,height:"auto",width:"600px",modal:!0,title:bizagi.localization.getResource("workportal-project-plan-progress-title"),maximize:!0,open:$.proxy(e.onOpenPopupPlan,e),close:function(){e.dialogBox.formContent.dialog("destroy"),e.dialogBox.formContent.detach()}}),e.previusValueProgress=e.formEditProgress.sliderProgress.slider("value")},onChangeNumericTextBoxProgress:function(e){var t=this.formEditProgress.numericTextBoxPlugin.spinner("value");this.formEditProgress.sliderProgress.slider("value",t)},onChangesliderProgress:function(e){var t=this.formEditProgress.sliderProgress.slider("value");this.formEditProgress.numericTextBoxPlugin.spinner("value",t)},onClickCancel:function(e){e.preventDefault();var t=this;t.dialogBox.formContent.dialog("destroy"),t.dialogBox.formContent.detach(),t.formEditProgress.sliderProgress.slider("value",t.previusValueProgress),t.formEditProgress.numericTextBoxPlugin.spinner("value",t.previusValueProgress)},onSubmitFormChangeProgress:function(e){e.preventDefault();var t=this;t.formEditProgress.buttonChangeProgress.prop("disabled",!0);var i=t.params.plan.activities.filter(function(e){return e.id==t.params.plan.idActivitySelected})[0],a=$.extend(i,{progress:t.formEditProgress.numericTextBoxPlugin.spinner("value"),idPlan:t.params.plan.id});$.when(t.dataService.editActivityPlan(a)).done(function(){t.formEditProgress.buttonChangeProgress.prop("disabled",!1),i.progress=t.formEditProgress.numericTextBoxPlugin.spinner("value"),t.updateProgressUI(i.progress),t.dialogBox.formContent.dialog("destroy"),t.dialogBox.formContent.detach()})}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.progress",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.activity.progress],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.subprocesses",{},{init:function(e,t,i){this._super(e,t,i),this.loadTemplates({"project-subprocesses":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.subprocesses").concat("#project-plan-activity-plan-subprocesses-wrapper"),"project-subprocesses-tootip-custom-properties":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.subprocesses").concat("#project-activity-plan-subprocesses-tooltip-custom-properties-wrapper")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.subprocesses",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.activity.subprocesses]),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.parent",{},{init:function(e,t,i){this._super(e,t,i),this.loadTemplates({"plan-parent-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.parent").concat("#project-plan-activity-parent")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){this.sub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(this.onNotifyLoadInfoActivityExecution,this))},onNotifyLoadInfoActivityExecution:function(e,t){var i=this;i.params=$.extend(i.params,t.args);var a=i.getContent().empty();$.when(i.dataService.getPlanParent({idPlan:i.params.plan.id})).done(function(e){if(i.params.plan.parent=e,i.params.plan.parent){var t={};t.parent={idParent:i.params.plan.parent.radNumber,nameParent:i.params.plan.parent.displayName,idCase:i.params.plan.parent.idCase,idWorkflow:i.params.plan.parent.idWorkflow,idWorkItem:i.params.plan.parent.idWorkItem,idTask:i.params.plan.parent.idTask},i.getTemplate("plan-parent-main").render(t).appendTo(a),$("#go-to-parent-case",a).on("click",$.proxy(i.onClickGoToParentCase,i))}})},onClickGoToParentCase:function(e){e.preventDefault();this.routingExecute($(e.target).closest("#go-to-parent-case"))}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.parent",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.activity.parent],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.users",{},{init:function(e,t,i){var a=this;a.usersMap={},a.plugins={},a.usersInformation=[],a.globalHandlersService=bizagi.injector.get("globalHandlersService"),a.usersAssignees=[],a._super(e,t,i),a.loadTemplates({"plan-users-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.users").concat("#project-plan-users")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){this.sub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(this.onNotifyLoadInfoActivityExecution,this))},activityRuning:function(e){return null!==e.startDate&&null===e.finishDate},onNotifyLoadInfoActivityExecution:function(e,t){var i=this,a=[],r=[],n=i.getContent().empty();i.params=$.extend(i.params,t.args);var o=i.params.plan.idUserCreator,s=i.params.plan.idUserCreator;r.push({idUser:o,guidUser:s,userType:["owner"]}),i.usersMap["-"+o+"-"]={picture:"",id:o,guid:s,name:"",userType:["owner"]},a.push(s),$.each(i.params.plan.activities,function(e,t){if(i.activityRuning(t)){var n=t.userAssigned,s=t.userAssignedGuid;if(n===o)-1===$.inArray("Assigned",r[0].userType)&&(r[0].userType.push("Assigned"),i.usersMap["-"+o+"-"].userType.push("Assigned"));else if(i.usersMap["-"+n+"-"]={picture:"",id:n,name:"",userType:["Assigned"]},0===r.filter(function(e){return e.idUser==n}).length){var p=s||n;r.push({idUser:p,userGuid:p,userType:["Assigned"]}),a.push(p)}}}),i.activitiesUsers=r,i.getTemplate("plan-users-main").render({assignee:i.justAssignees(r),label:bizagi.localization.getResource("workportal-project-plan-assignee")}).appendTo(n),i.addEventHandlersModal(),$.when(i.callGetDataUsers(a)).then(function(){i.showCreatorInformation(o),i.renderUserProfilesAndImages()})},justAssignees:function(e){var t=[];return e.map(function(e){var i=-1!==e.userType.indexOf("owner"),a=-1!==e.userType.indexOf("Assigned");t.push(usersAdapter.createJsonUserInfo(e.idUser,"","","","","",a,i,[],[]))}),usersAdapter.justAssignees(t)},showCreatorInformation:function(e){var t=this.usersMap["-"+e+"-"],i=usersAdapter.createJsonUserInfo(t.id,t.name,t.username,t.picture?t.picture:void 0,t.email,t.name.getInitials(),!1,!0,[],[]);this.content.find(".ui-bizagi-wp-project-plan-users .ui-bizagi-wp-project-users-creator-info").userinformation(this,{user:i})},renderUserProfilesAndImages:function(){var e=this;$.each(e.usersMap,function(t,i){var a=$(".ui-bizagi-wp-userlist li[data-iduser="+i.id+"]",e.content);""!==i.picture?a.find("img").prop("src",i.picture):(a.find("img").hide(),void 0!==i.name?a.find("span").html(i.name.getInitials()):console.log("obj.name is undefined"))}),$(".ui-bizagi-wp-userlist li",e.content).not(".moreUsers").on("mouseenter",function(t){var i,a=$(t.target),r=$(this).data("iduser");$.each(e.usersMap,function(e,t){t.id===r&&(i=t)});var n=e.usersAssignees.find(function(e){return e.userAssigned===i.id}),o=[];n&&n.activities.map(function(e){o.push(e.name)});var s=usersAdapter.createJsonUserInfo(i.id,i.name,i.username,i.picture,i.email,i.name.getInitials(),e.getIsAssignee(i),e.getIsOwner(i),o,void 0);a.parent().usertooltip(e,{target:a,user:s})})},getIsAssignee:function(e){return e.userType.indexOf("Assigned")>-1},getIsOwner:function(e){return e.userType.indexOf("owner")>-1},callGetDataUsers:function(e){var t,i=this,a=$.Deferred();return t={usersGuids:e.join(),width:50,height:50},$.when(i.dataService.getUsersData(t)).always(function(e){i.usersInformation=e;for(var t=0,r=e.length;t<r;t+=1)void 0===e[t].name?bizagi.log(e[t]+" Id Not Found",e,"error"):i.usersMap["-"+e[t].id+"-"]?(i.usersMap["-"+e[t].id+"-"].picture+=e[t].picture?"data:image/png;base64,"+e[t].picture:"",i.usersMap["-"+e[t].id+"-"].name=e[t].name||"",i.usersMap["-"+e[t].id+"-"].username=e[t].username||"",i.usersMap["-"+e[t].id+"-"].email=e[t].email||""):console.log("The object is undefined");i.getUsersAssignees(),a.resolve()}),a.promise()},getUsersAssignees:function(){for(var e=0;e<this.usersInformation.length;e++)this.usersAssignees.push(this.getUserAssignee(this.usersInformation[e]))},getUserAssignee:function(e){var t=this,i=[];$.each(t.params.plan.activities,function(a,r){r.userAssigned===e.id&&t.activityRuning(r)&&i.push({name:r.name})}),e.tasks=i;var a=t.activitiesUsers.find(function(t){return t.idUser==e.id});return e.userType=a.userType,usersAdapter.createJsonUserInfo(e.id,e.name,e.username,e.picture?"data:image/png;base64,"+e.picture:void 0,e.email,e.name.getInitials(),t.getIsAssignee(e),t.getIsOwner(e),e.tasks,[])},addEventHandlersModal:function(){var e=this;$(".moreUsers").click(function(t){t.preventDefault(),t.stopPropagation();var i=e.usersAssignees||[];e.globalHandlersService.publish("showDialogWidget",{widgetName:bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_USERS_MODAL,closeVisible:!0,data:i,maximize:!0,modalParameters:{title:bizagi.localization.getResource("workportal-project-users-title")+" ("+i.length+")",width:790,height:526,refreshInbox:!1}})})}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.users",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.activity.users],!0);
//# sourceMappingURL=../../../../Maps/desktop/activityplan.desktop.production.js.map

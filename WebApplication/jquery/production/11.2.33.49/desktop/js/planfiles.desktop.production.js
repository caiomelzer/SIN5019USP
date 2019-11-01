bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.dashboard.menu.plan",{},{init:function(e,t,i,a){var r=this;r.params=a||{},r.projectDashboard=i,r._super(e,t,a),r.loadTemplates({"project-dashboard-menu":bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.dashboard.menu.plan").concat("#project-dashboard-menu")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){var e=this;e.params&&e.params.contextsLeftSidebarCaseDashboard&&e.params.contextsLeftSidebarCaseDashboard.forEach(function(t){e.sub(t,$.proxy(e.updateView,e))})},updateView:function(e,t){var i=this;i.params=$.extend(i.params,t.args),i.clean();var a=i.getContent().empty(),r=i.getTemplate("project-dashboard-menu");i.params.menuPlanDashboard=i.params.menuPlanDashboard||{},$.extend(i.params.menuPlanDashboard,i.params.menuDashboard),i.planState=i.getPlanState(i.params.plan,i.params.planChild);var o={planState:i.planState,showCommentsOptionMenu:i.params.menuPlanDashboard.showCommentsOptionMenu,showFilesOptionMenu:i.params.menuPlanDashboard.showFilesOptionMenu,showTimeLineOptionMenu:i.params.menuPlanDashboard.showTimeLineOptionMenu&&i.isVisibleShowTimeLine(i.planState)};r.render(o).appendTo(a),$("li[data-context='"+i.params.showContextByMenuDashboard.toUpperCase()+"']",i.content).addClass("active").siblings().removeClass("active"),i.handlerEvents()},getPlanState:function(e,t){var i;return t&&t.currentState?i=t.currentState:e&&e.currentState&&(i=e.currentState),i},isVisibleShowTimeLine:function(e){var t=!0;return"PENDING"===e&&(t=!1),t},loadContentById:function(e){var t=this;e.preventDefault();var i=$(e.target).closest("li");if("PLANBACK"===i.data("context"))t.backParentPlan();else if(!i.hasClass("active")){var a=i.data("context");a&&(t.pub("notify",{type:a.toUpperCase(),args:$.extend(t.params,{showContextByMenuDashboard:a})}),$("li[data-context='"+t.params.showContextByMenuDashboard.toUpperCase()+"']",t.content).addClass("active").siblings().removeClass("active"))}},subMenuHandler:function(){var e=this,t=e.getContent(),i=$("[data-context='PLANCOMMENTS']",t),a=$("[data-context='PLANFILES']",t),r=$("[data-context='PLANTIMELINE']",t);$(".ui-bizagi-wp-project-tab-submenu a",t).on("click",function(){i.toggle(),a.toggle(),e.isVisibleShowTimeLine(e.planState)&&r.toggle()})},backParentPlan:function(){var e=this,t=e.pub("notify",{type:"NAVIGATOR_GETLEVEL"}),i=parseInt(t[0]),a=e.projectDashboard.getParamsByBackFromPlan(e.params,i);e.pub("notify",{type:a.typeContext,args:$.extend(e.params,a.paramsNotify)})},handlerEvents:function(){var e=this,t=e.getContent();e.subMenuHandler(),$(".ui-bizagi-wp-project-tab-links a",t).on("click",$.proxy(e.loadContentById,e))},clean:function(){var e=this,t=e.getContent();$(".ui-bizagi-wp-project-tab-links a",t).off(),e.params&&e.params.contextsLeftSidebarCaseDashboard&&e.params.contextsLeftSidebarCaseDashboard.forEach(function(t){e.unsub(t,$.proxy(e.updateView,e))})}}),bizagi.injector.register("bizagi.workportal.widgets.project.dashboard.menu.plan",["workportalFacade","dataService","bizagi.workportal.services.behaviors.projectDashboard",bizagi.workportal.widgets.project.dashboard.menu.plan],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.content.dashboard",{},{init:function(e,t,i){this._super(e,t,i),this.loadTemplates({"project-content-dashboard":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.content.dashboard").concat("#project-plan-content-dashboard")})},renderContent:function(){var e=this,t=e.getTemplate("project-content-dashboard");return e.content=t.render({}),e.content},postRender:function(){setTimeout(function(){$(window).trigger("resize")},1e3)}}),bizagi.injector.register("bizagi.workportal.widgets.project.content.dashboard",["workportalFacade","dataService",bizagi.workportal.widgets.project.content.dashboard],!0),function(e){var t=window.kendo.ui,i=t.Widget,a=i.extend({init:function(e,t){var a=this;i.fn.init.call(a,e,t),a._maxFilesSize=t.maxSize,a._fileList=[],a._onlyValidateServerFileExtension=t.onlyValidateServerFileExtension||!0,a._supportFileExt=t.extensions,a._uploadMaxFilesSize=t.maxSize,a.upload=a._initUpload(),a.loadNotifier=a._initLoadNotifier(),a.notification=a._initNotification(),a._eventsHandler(),a._initLocalization(a.options.localization)},options:{name:"ProjectAttachments",wrapper:e('<div class="project-attachments"></div>'),multiple:!0,dropZone:!0,maxFilesSize:bizagi.currentUser?bizagi.currentUser.uploadMaxFileSize:25e3,enabled:!0,localization:{}},_initUpload:function(){var e=this,t=e.options,i=t.localization||{},a=0;return e._initLocalization(i),this.element.kendoUpload({async:{saveUrl:t.saveUrl+"?xsrf="+bizagi.getXSRFToken(),autoUpload:!0},select:function(t){e._filterMaxFilesSize(t),a=0},complete:function(){var t=setInterval(function(){0===e.loadNotifier.wrapper.find("li.k-file-progress").length&&(e._showNotificationCompleteUpload(e.loadNotifier.wrapper,a),clearInterval(t))},300)},upload:t.upload,progress:function(t){e._onProgressFile(t)},success:function(i){e._fileList.push(i.files[0]),a+=1,t.success(i)},error:function(t){e.onErrorFile(t)},localization:{select:i.selectFiles,dropFilesHere:i.dropFilesHere},multiple:t.multiple,enabled:t.enabled,dropZone:t.dropZone,showFileList:!1}).data("kendoUpload")},_initNotification:function(){return e("<div></div>").kendoNotification({position:{pinned:!0}}).data("kendoNotification")},_initLoadNotifier:function(){var e=this.options.localization;return this.options.wrapper.kendoWindow({title:e.notifierTitle,actions:["Close"],animation:{open:{duration:100},close:{duration:100}},open:function(){this.wrapper.addClass("project-attachments-wrapper-window")},visible:!1,resizable:!1,draggable:!1,maxHeight:"300px",minWidth:"430px"}).data("kendoWindow")},_initLocalization:function(t){var i={selectFiles:bizagi.localization.getResource("workportal-project-attachments-addfiles"),notifierTitle:bizagi.localization.getResource("workportal-project-attachments-notifiertitle"),errorUpload:bizagi.localization.getResource("workportal-project-attachments-file-error-type"),errorSecurity:bizagi.localization.getResource("workportal-project-attachments-blockedext"),errorSize:bizagi.localization.getResource("workportal-project-attachments-blockedsize"),errorMaxFilesSize:bizagi.localization.getResource("workportal-project-discussion-maxfilessize").replace("%s",Math.round(this._maxFilesSize/1e6,-1)),dropFilesHere:bizagi.localization.getResource("workportal-project-attachments-drophere"),cancel:bizagi.localization.getResource("workportal-widget-reports-confirm-cancel"),retry:bizagi.localization.getResource("workportal-project-attachments-retry"),close:bizagi.localization.getResource("workportal-widget-dialog-box-close")};e.extend(t,i)},_onProgressFile:function(t){var i=this._getFileItemByUID(t.files[0].uid),a=t.percentComplete;e(".k-progress",i).css({width:a+"%"}),e(".k-upload-pct",i).removeClass("k-icon k-loading").text(a+"%"),100===a&&e(".k-upload-action .k-icon",i).hide()},_onShowUploadNotifier:function(e){var t=e.files,i=this.options.template;this.loadNotifier.content(i.render({files:t})),this.loadNotifier.wrapper.css({top:"auto",left:"auto",bottom:"1em",right:"1em"}),this.loadNotifier.open()},_showNotificationCompleteUpload:function(e,t){e.find("li.k-file-success").length===t&&0===e.find("li.k-file-error").length&&this._autoHideMessage(e)},_autoHideMessage:function(e){var t=this;setTimeout(function(){e.fadeOut(function(){t.loadNotifier.close()})},2e3)},_onCancelFile:function(e){var t=e.closest("li"),i=this.upload.wrapper,a=t.data("guid");i.find("li[data-uid="+a+"] .k-upload-action").trigger("click"),t.remove()},_onRemoveFile:function(e){e.closest("li").remove()},_onRetryFile:function(t){var i=t.closest("li").data("guid"),a=e.grep(this._fileList,function(e){return e.uid===i});this.options.retry(a[0])},onErrorFile:function(e){var t=this.options.localization,i=e.files[0],a=this._isValidFile(i),r=""!==a.message?a.message:t.errorUpload;this.setStatus("ERROR",i.uid,r)},_isValidFile:function(t){var i=this.options.localization,a=!0,r="";return(t.size>this._uploadMaxFilesSize||null==t.size||0==t.size)&&(r=i.errorSize,a=!1),this._onlyValidateServerFileExtension||-1===e.inArray(t.extension,this._supportFileExt)&&(r=i.errorSecurity,a=!1),{valid:a,message:r}},_filterMaxFilesSize:function(e){for(var t=0,i=0,a=e.files.length;i<a;i++)t+=e.files[i].size;t>this._maxFilesSize?(this._notifySizeExceeded(),e.preventDefault()):this._onShowUploadNotifier(e)},_notifySizeExceeded:function(){this.notification.show(this.options.localization.errorMaxFilesSize,"error")},_getFileItemByUID:function(t){return e("li[data-guid="+t+"]",this.loadNotifier.element)},_switchEvents:function(t){var i=e(".k-icon",t.currentTarget);i.hasClass("k-update")||i.hasClass("k-remove")?this._onRemoveFile(i):i.hasClass("k-retry")?this._onRetryFile(i):i.hasClass("k-cancel")&&this._onCancelFile(i)},_eventsHandler:function(){var e=this;e.loadNotifier.element.on("click","button.k-upload-action",function(t){e._switchEvents(t)})},cancelFilesUpload:function(){this.upload.wrapper.find("li .k-upload-action").trigger("click"),this.close()},close:function(){this.loadNotifier.close()},destroy:function(){this.loadNotifier.destroy(),this.upload.destroy()},setStatus:function(t,i,a){var r=this._getFileItemByUID(i),o=this.options.localization;switch(t){case"SUCCESS":r.removeClass("k-file-progress k-file-error").addClass("k-file-success"),e(".k-upload-action .k-icon",r).removeClass("k-cancel k-i-refresh k-retry").addClass("k-update").prop("title",o.close).show(),e(".k-errormsg",r).text("");break;case"ERROR":r.removeClass("k-file-progress").addClass("k-file-error"),e(".k-upload-action .k-icon",r).removeClass("k-i-refresh k-retry").addClass("k-remove").show(),e(".k-upload-status .k-upload-pct",r).removeClass("k-upload-pct k-loading").addClass("k-icon k-warning"),e(".k-errormsg",r).text(a).prop("title",a);break;case"RETRY":r.removeClass("k-file-progress").addClass("k-file-error"),e(".k-upload-status .k-upload-pct",r).removeClass("k-upload-pct k-loading").addClass("k-warning").text(""),e(".k-upload-action .k-icon",r).removeClass("k-cancel k-remove").addClass("k-i-refresh k-retry").prop("title",o.retry).show(),e(".k-errormsg",r).text(o.errorUpload).prop("title",o.errorUploadiis)}}});t.plugin(a)}(jQuery),bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.files",{},{init:function(e,t,i){var a=this;a._super(e,t,i),a.plugins={},a.prefixBase64="data:image/png;base64,",a.usersData={},a.currentFilesList=[],a.fileDateInterval,a.loadTemplates({"project-files":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.files").concat("#project-files-wrapper"),"project-files-uploaditem":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.files").concat("#project-files-uploaditem"),"project-files-list":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.files").concat("#project-files-list"),"project-attachments":bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.attachments").concat("#project-attachments")})},renderContent:function(){var e=this.getTemplate("project-files");return this.content=e.render({isOpen:!bizagi.util.parseBoolean(this.params.isClosedForAllUsers)}),this.content},postRender:function(){var e=this;$.when(e.renderFilesList()).done(function(){e.plugins.uploadFiles=e.initializeUploadFiles(),e.eventsHandler(),e.restrictedEventsHandler()})},renderFilesList:function(){var e=this,t=$.Deferred(),i=e.currentFilesList.length,a={globalParent:encodeURIComponent(e.radNumber),dateTime:i?e.currentFilesList[i-1].date:e.getDateServer(),count:12};return"FLOW-DECONTEXTUALIZED-PLANS"===e.params.flowContext&&(a.globalParent=e.params.plan.id),$.when(e.dataService.getFilesListByRadNumber(a)).done(function(i){e.currentFilesList=e.currentFilesList.concat(i),e.renderFiles(i),t.resolve()}),t.promise()},renderFiles:function(e){var t=this,i=t.getContent(),a=$("#project-files-showmore",i);t.displayFileList(e,"append"),t.updateRelativeTime(),e.length&&t.setAdditionalData(e),t.currentFilesList.length>=12&&(a.show(),e.length<12&&($("button",a).remove(),$("#project-files-nomore",a).show())),t.notifyFilesNumber(!1)},renderNoFiles:function(){var e=this.workportalFacade.getTemplate("info-message"),t=this.resources.getResource("workportal-project-files-noavailable"),i=$.tmpl(e,{message:t});this.content.html(i)},initializeUploadFiles:function(){var e=this,t=e.getContent();return $("#project-files-upload",t).kendoProjectAttachments({saveUrl:e.dataService.serviceLocator.getUrl("project-comments-uploadfiles"),template:e.getTemplate("project-attachments"),success:$.proxy(e.onSuccessFile,e),upload:$.proxy(e.addFileData,e),retry:$.proxy(e.onSaveFileData,e),enabled:!0,extensions:e.supportFileExt,maxSize:e.uploadMaxFilesSize}).data("kendoProjectAttachments")},setAdditionalData:function(e){for(var t=[],i=[],a=[],r=0,o=e.length-1;r<=o;r++)i.push(e[r].user),a.push(e[r].user),t.push(e[r].attachment.guid);this.setUserData(a.join()),this.setThumbnails(t.join())},setUserData:function(e){var t=this,i=t.getContent(),a={usersGuids:e,width:50,height:50};$.when(t.dataService.getUsersData(a)).done(function(e){for(var a=0,r=e.length-1;a<=r;a++)e[a].picture&&(e[a].picture=t.prefixBase64+e[a].picture),t.usersData["id"+e[a].id]=e[a],$("#project-files-list .ui-bizagi-wp-project-files-user[data-userId="+e[a].id+"]",i).text(e[a].name)})},getFileInfoByGuid:function(e){for(var t,i=0,a=this.currentFilesList.length;i<a;i++)e===this.currentFilesList[i].guid&&(t=this.currentFilesList[i],i=a);return t},setThumbnails:function(e){var t=this,i=t.getContent(),a={guids:e,width:480,height:150};$.when(t.dataService.getFilesThumbnails(a)).done(function(e){var a,r,o;$.each(e,function(e,n){e=e.toLowerCase(),a=t.prefixBase64+n,r=$("#project-files-list .ui-bizagi-wp-project-files-wrapitem[data-attchGuid="+e+"]",i),(o=$(".ui-bizagi-wp-project-files-thumbnail",r)).prop("src",a),$(".ui-bizagi-wp-project-files-icon",r).remove(),o.css("display","block")})})},setFilePreview:function(e,t,i){var a=this,r="",o={guids:[t].join(),width:500,height:500};$.when(a.dataService.getFilesThumbnails(o)).done(function(t){var o=e.find(".ui-bizagi-wp-project-files-user").data("userid");$.each(t,function(e,t){r=a.prefixBase64+t}),a.pub("notify",{type:"FILEPREVIEW",args:{radNumber:encodeURIComponent(a.radNumber),fileData:a.getFileInfoByGuid(i),userData:a.usersData["id"+o],isOpen:!bizagi.util.parseBoolean(a.params.isClosedForAllUsers),img:r}}),a.pub("notify",{type:"OPEN_RIGHT_SIDEBAR"})})},onSuccessFile:function(e){(e.XMLHttpRequest.response?JSON.parse(e.XMLHttpRequest.response):{}).error?this.plugins.uploadFiles.onErrorFile(e):this.onSaveFileData(e.files[0])},onSaveFileData:function(e){var t=this;$.when(t.saveFileData(e)).done(function(){t.notifyFilesNumber(),t.plugins.uploadFiles.setStatus("SUCCESS",e.uid)}).fail(function(){t.plugins.uploadFiles.setStatus("RETRY",e.uid)})},onRetryFile:function(e){var t=e.closest("li"),i=t.data("guid"),a=$.grep(this.currentFilesList,function(e){return e.uid===i});this.onSaveFileData(t,a[0])},addFileData:function(e){e.data={guid:e.files[0].uid}},saveFileData:function(e){var t=this,i=$.Deferred(),a=Math.guid(),r=t.radNumber?t.radNumber.toString():"";"FLOW-DECONTEXTUALIZED-PLANS"===t.params.flowContext&&(r=t.params.plan.id);var o={content:{guid:a,description:"",name:e.name,attachment:{guid:e.uid,name:e.name},date:t.getDateServer(),user:bizagi.currentUser.idUser,globalParent:r},attachmentsToCreate:[e.uid]};return t.currentFilesList.unshift(e),$.when(t.dataService.createProjectFile(o)).always(function(a){200===a.status||201===a.status||void 0===a.status?($.extend(e,{user:bizagi.currentUser.idUser,userName:bizagi.currentUser.userName,date:(new Date).getTime(),attachment:o.content.attachment,guid:o.content.guid,description:o.content.description}),t.usersData["id"+bizagi.currentUser.idUser]={picture:bizagi.currentUser.photo,name:bizagi.currentUser.userName,id:bizagi.currentUser.idUser},t.displayFileList(e,"prepend"),t.updateRelativeTime(),t.setThumbnails(e.uid),i.resolve()):i.reject()}),i},displayFileList:function(e,t){var i=this.getTemplate("project-files-list"),a=(e=e||this.currentFilesList,this.getContent()),r=i.render({files:e});$("#project-files-list",a)[t](r),$.equalizeHeights(".bz-card")},deleteFile:function(e,t){var i=this.getContent();$("div[data-fileguid='"+t.args.guid+"']",i).remove(),this.currentFilesList=this.currentFilesList.filter(function(e){return e.guid!==t.args.guid}),this.notifyFilesNumber(!0)},updateFileData:function(e,t){this.getFileInfoByGuid(t.args.guid).description=t.args.description},updateRelativeTime:function(){var e=this;e.fileDateInterval&&clearInterval(e.fileDateInterval),e.fileDateInterval=setInterval($.proxy(e.changeRelativeTime,e),"7000")},changeRelativeTime:function(){var e=this.getContent();$("#project-files-list .ui-bizagi-wp-project-files-date",e).each(function(e,t){var i=$(t).data("date"),a=bizagi.util.dateFormatter.getRelativeTime(new Date(i),null,!1);$(t).text(a)})},onSelectFiles:function(e){for(var t=[],i=e.files,a=i.length-1;a>=0;a--)if(!this.isValidFile(i[a]).valid){var r=i.splice(a,a+1);t.unshift(r[0])}t.length>0&&this.showFilesError(t)},resetWidget:function(){this.plugins.uploadFiles&&this.plugins.uploadFiles.close(),this.currentFilesList=[],clearInterval(this.fileDateInterval)},switchFilesEvents:function(e){e.stopPropagation();var t=$(e.target),i=t.closest(".ui-bizagi-wp-project-files-wrapitem");if(i.length){var a=i.data("attchguid"),r=i.data("fileguid");if(t.hasClass("ui-bizagi-wp-project-files-file")){var o=t.text();this.dataService.getDownloadAttachment(a,o)}else this.setFilePreview(i,a,r)}else"project-files-showmore"===t.parent().prop("id")?this.renderFilesList():"project-files-upload"!==t.prop("id")&&this.notifyFilesNumber(!0)},notifyFilesNumber:function(e){this.pub("notify",{type:"SETFILESNUMBER",args:{filesNumber:this.currentFilesList.length,mandatory:e}})},restrictedEventsHandler:function(){this.content.on("click",$.proxy(this.switchFilesEvents,this))},eventsHandler:function(){var e=this,t=e.getContent();e.sub("changeProjectWidget",$.proxy(e.resetWidget,e)),e.sub("UPDATEFILE",$.proxy(e.updateFileData,e)),e.sub("DELETEFILE",$.proxy(e.deleteFile,e)),t.on("click",$.proxy(e.switchFilesEvents,e))},clean:function(){var e=this;for(var t in e.resetWidget(),e.unsub("changeProjectWidget",$.proxy(e.resetWidget,e)),e.unsub("UPDATEFILE",$.proxy(e.updateFileData,e)),e.unsub("DELETEFILE",$.proxy(e.deleteFile,e)),e.plugins)e.plugins[t]&&e.plugins[t].destroy();clearInterval(e.fileDateInterval),e._super()}}),bizagi.injector.register("bizagi.workportal.widgets.project.files",["workportalFacade","dataService",bizagi.workportal.widgets.project.files],!0),bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.filesPreview",{},{init:function(e,t,i,a){var r=this;r.datePickerRegional=bizagi.localization.getResource("datePickerRegional"),r.dialogBox={},r._super(e,t,a),r.notifier=i,r.loadTemplates({"project-filespreview-wrapper":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.filesPreview").concat("#project-filespreview-wrapper"),"project-filespreview-preview":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.filesPreview").concat("#project-filespreview-preview"),"project-filespreview-popup":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.filesPreview").concat("#project-filespreview-popup"),"project-filespreview-thenumber":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.filesPreview").concat("#project-filespreview-thenumber")})},renderContent:function(){var e=this,t=e.getTemplate("project-filespreview-wrapper");return e.content=t.render(),e.sub("SETFILESNUMBER",$.proxy(e.setFilesNumber,e)),e.content},postRender:function(){var e=this;e.plugins.fileEdition=e.initPluginPopupEdition(),e.form={description:$("#ui-bizagi-wp-project-filespreview-popup-description",e.plugins.fileEdition),image:$(".ui-bizagi-wp-project-popupform-user-image",e.plugins.fileEdition),cancel:$("#ui-bizagi-wp-project-popupform-action-cancel",e.plugins.fileEdition),edit:$("#ui-bizagi-wp-project-popupform-action-editfile",e.plugins.fileEdition)},e.eventsHandler()},setFilesNumber:function(e,t){var i=t.args;if($.isEmptyObject(this.currentFile)||i.mandatory){var a=this.getTemplate("project-filespreview-thenumber").render({filesNumber:i.filesNumber});this.currentFile={},$("#ui-bizagi-wp-project-filespreview-wrapper",this.content).html(a)}},initPluginPopupEdition:function(){var e=this.getTemplate("project-filespreview-popup");return this.dialogBox.formContent=e.render(),this.dialogBox.formContent},showPreview:function(e,t){var i=this.getTemplate("project-filespreview-preview");this.currentFile=t.args;var a=i.render($.extend(t.args,{idCurrentUser:bizagi.currentUser.idUser}));$("#ui-bizagi-wp-project-filespreview-wrapper",this.content).html(a),this.applyMenu()},setEditionData:function(){var e=this;e.form.description.val(e.currentFile.fileData.description),e.currentFile.userData.picture&&e.form.image.prop("src",e.currentFile.userData.picture)},eventsHandler:function(){var e=this;e.form.cancel.on("click",$.proxy(e.onResetFileForm,e)),e.form.edit.on("click",$.proxy(e.onSaveEdition,e)),e.sub("FILEPREVIEW",$.proxy(e.showPreview,e))},onSelectMenu:function(e,t){if(0===$(e.currentTarget).find("i").length)switch($(t.item).data("item")){case"edit":this.onOpenEdition();break;case"delete":this.onDeleteFile();break;case"download":this.onDownloadFile()}},onDownloadFile:function(){this.dataService.getDownloadAttachment(this.currentFile.fileData.attachment.guid,this.currentFile.fileData.name)},onOpenEdition:function(){var e=this;e.dialogBox.formContent.dialog({resizable:!1,draggable:!1,height:"auto",width:"650px",modal:!0,title:bizagi.localization.getResource("workportal-project-files-editfile"),maximize:!0,close:function(){e.onResetFileForm()}}),e.setEditionData(),e.form.description.focus()},onDeleteFile:function(){var e=this;$.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-project-file-querydelete"),"","info")).done(function(){var t={content:{guid:e.currentFile.fileData.guid},attachmentsToDelete:[e.currentFile.fileData.attachment.guid]};$.when(e.dataService.deleteFile(t)).always(function(i){200!==i.status&&201!==i.status&&void 0!==i.status||e.pub("notify",{type:"DELETEFILE",args:{guid:t.content.guid}})})})},onSaveEdition:function(){var e=this;if(e.validateAddFileDescriptionForm(e.form.description)){e.currentFile.fileData.description=e.form.description.val();var t={content:{guid:e.currentFile.fileData.guid,description:e.currentFile.fileData.description,attachment:e.currentFile.fileData.attachment,name:e.currentFile.fileData.name,date:e.currentFile.fileData.date,user:bizagi.currentUser.idUser,globalParent:e.currentFile.radNumber}};$.when(e.dataService.updateProjectFile(t)).always(function(i){200===i.status||201===i.status||void 0===i.status?($("#ui-bizagi-wp-project-filespreview-description",e.content).text(t.content.description),e.onResetFileForm(),e.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-project-files-editionsuccess"),"")),e.pub("notify",{type:"UPDATEFILE",args:{description:t.content.description,guid:t.content.guid}})):(e.onResetFileForm(),e.notifier.showErrorMessage(printf(bizagi.localization.getResource("workportal-general-error-generic"),"")))})}},validateAddFileDescriptionForm:function(e){var t=!1,i=e;if(""===i.val().trim()){var a=bizagi.localization.getResource("workportal-project-discussion-requireddescription");i.parent().next().find("span").html(a)}else i.parent().next().find("span").empty(),t=!0;return t},onResetFileForm:function(){this.form.description.parent().next().find("span").empty(),this.dialogBox.formContent.dialog("destroy"),this.dialogBox.formContent.detach()},applyMenu:function(){$(".ui-bizagi-wp-project-filespreview-edit",this.content).menu({select:$.proxy(this.onSelectMenu,this)}).removeClass("ui-widget-content")},clean:function(){this.plugins={},this.form={},this.currentFile={},this.filesNumber=0}}),bizagi.injector.register("bizagi.workportal.widgets.project.filesPreview",["workportalFacade","dataService","notifier",bizagi.workportal.widgets.project.filesPreview]),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.file.sidebar",{},{init:function(e,t,i){this._super(e,t,i),(i=i||{}).supportNav=!1,this.loadTemplates({"project-file-sidebar":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.file.sidebar").concat("#project-file-sidebar")})},getWidgetName:function(){return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_FILE_SIDEBAR},renderContent:function(){var e=this.getTemplate("project-file-sidebar");return this.content=e.render({}),this.content}}),bizagi.injector.register("bizagi.workportal.widgets.project.file.sidebar",["workportalFacade","dataService",bizagi.workportal.widgets.project.file.sidebar],!0);
//# sourceMappingURL=../../../../Maps/desktop/planfiles.desktop.production.js.map

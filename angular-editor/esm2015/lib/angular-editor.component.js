/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Attribute, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input, Output, Renderer2, SecurityContext, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { angularEditorConfig } from './config';
import { AngularEditorToolbarComponent } from './angular-editor-toolbar.component';
import { AngularEditorService } from './angular-editor.service';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { isDefined } from './utils';
export class AngularEditorComponent {
    /**
     * @param {?} r
     * @param {?} editorService
     * @param {?} doc
     * @param {?} sanitizer
     * @param {?} cdRef
     * @param {?} defaultTabIndex
     * @param {?} autoFocus
     */
    constructor(r, editorService, doc, sanitizer, cdRef, defaultTabIndex, autoFocus) {
        this.r = r;
        this.editorService = editorService;
        this.doc = doc;
        this.sanitizer = sanitizer;
        this.cdRef = cdRef;
        this.autoFocus = autoFocus;
        this.modeVisual = true;
        this.showPlaceholder = false;
        this.disabled = false;
        this.focused = false;
        this.touched = false;
        this.changed = false;
        this.id = '';
        this.config = angularEditorConfig;
        this.placeholder = '';
        this.viewMode = new EventEmitter();
        /**
         * emits `blur` event when focused out from the textarea
         */
        // tslint:disable-next-line:no-output-native no-output-rename
        this.blurEvent = new EventEmitter();
        /**
         * emits `focus` event when focused in to the textarea
         */
        // tslint:disable-next-line:no-output-rename no-output-native
        this.focusEvent = new EventEmitter();
        this.tabindex = -1;
        /** @type {?} */
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
    }
    /**
     * @return {?}
     */
    onFocus() {
        this.focus();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.config.toolbarPosition = this.config.toolbarPosition ? this.config.toolbarPosition : angularEditorConfig.toolbarPosition;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (isDefined(this.autoFocus)) {
            this.focus();
        }
    }
    /**
     * Executed command from editor header buttons
     * @param {?} command string from triggerCommand
     * @return {?}
     */
    executeCommand(command) {
        this.focus();
        if (command === 'toggleEditorMode') {
            this.toggleEditorMode(this.modeVisual);
        }
        else if (command !== '') {
            if (command === 'clear') {
                this.editorService.removeSelectedElements(this.getCustomTags());
                this.onContentChange(this.textArea.nativeElement.innerHTML);
            }
            else if (command === 'default') {
                this.editorService.removeSelectedElements('h1,h2,h3,h4,h5,h6,p,pre');
                this.onContentChange(this.textArea.nativeElement.innerHTML);
            }
            else {
                this.editorService.executeCommand(command);
            }
            this.exec();
        }
    }
    /**
     * focus event
     * @param {?} event
     * @return {?}
     */
    onTextAreaFocus(event) {
        if (this.focused) {
            event.stopPropagation();
            return;
        }
        this.focused = true;
        this.focusEvent.emit(event);
        if (!this.touched || !this.changed) {
            this.editorService.executeInNextQueueIteration((/**
             * @return {?}
             */
            () => {
                this.configure();
                this.touched = true;
            }));
        }
    }
    /**
     * \@description fires when cursor leaves textarea
     * @param {?} event
     * @return {?}
     */
    onTextAreaMouseOut(event) {
        this.editorService.saveSelection();
    }
    /**
     * blur event
     * @param {?} event
     * @return {?}
     */
    onTextAreaBlur(event) {
        /**
         * save selection if focussed out
         */
        this.editorService.executeInNextQueueIteration(this.editorService.saveSelection);
        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }
        if (event.relatedTarget !== null) {
            /** @type {?} */
            const parent = ((/** @type {?} */ (event.relatedTarget))).parentElement;
            // if (!parent.classList.contains('angular-editor-toolbar-set') && !parent.classList.contains('ae-picker')) {
            //   this.blurEvent.emit(event);
            //   this.focused = false;
            // }
        }
    }
    /**
     *  focus the text area when the editor is focused
     * @return {?}
     */
    focus() {
        if (this.modeVisual) {
            this.textArea.nativeElement.focus();
        }
        else {
            /** @type {?} */
            const sourceText = this.doc.getElementById('sourceText' + this.id);
            sourceText.focus();
            this.focused = true;
        }
    }
    /**
     * Executed from the contenteditable section while the input property changes
     * @param {?} html html string from contenteditable
     * @return {?}
     */
    onContentChange(html) {
        if ((!html || html === '<br>')) {
            html = '';
        }
        if (typeof this.onChange === 'function') {
            this.onChange(this.config.sanitize || this.config.sanitize === undefined ?
                this.sanitizer.sanitize(SecurityContext.HTML, html) : html);
            if ((!html) !== this.showPlaceholder) {
                this.togglePlaceholder(this.showPlaceholder);
            }
        }
        this.changed = true;
    }
    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = (/**
         * @param {?} e
         * @return {?}
         */
        e => (e === '<br>' ? fn('') : fn(e)));
    }
    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Write a new value to the element.
     *
     * @param {?} value value to be executed when there is a change in contenteditable
     * @return {?}
     */
    writeValue(value) {
        if ((!value || value === '<br>' || value === '') !== this.showPlaceholder) {
            this.togglePlaceholder(this.showPlaceholder);
        }
        if (value === undefined || value === '' || value === '<br>') {
            value = null;
        }
        this.refreshView(value);
    }
    /**
     * refresh view/HTML of the editor
     *
     * @param {?} value html string from the editor
     * @return {?}
     */
    refreshView(value) {
        /** @type {?} */
        const normalizedValue = value === null ? '' : value;
        this.r.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
        return;
    }
    /**
     * toggles placeholder based on input string
     *
     * @param {?} value A HTML string from the editor
     * @return {?}
     */
    togglePlaceholder(value) {
        if (!value) {
            this.r.addClass(this.editorWrapper.nativeElement, 'show-placeholder');
            this.showPlaceholder = true;
        }
        else {
            this.r.removeClass(this.editorWrapper.nativeElement, 'show-placeholder');
            this.showPlaceholder = false;
        }
    }
    /**
     * Implements disabled state for this element
     *
     * @param {?} isDisabled Disabled flag
     * @return {?}
     */
    setDisabledState(isDisabled) {
        /** @type {?} */
        const div = this.textArea.nativeElement;
        /** @type {?} */
        const action = isDisabled ? 'addClass' : 'removeClass';
        this.r[action](div, 'disabled');
        this.disabled = isDisabled;
    }
    /**
     * toggles editor mode based on bToSource bool
     *
     * @param {?} bToSource A boolean value from the editor
     * @return {?}
     */
    toggleEditorMode(bToSource) {
        /** @type {?} */
        let oContent;
        /** @type {?} */
        const editableElement = this.textArea.nativeElement;
        if (bToSource) {
            oContent = this.r.createText(editableElement.innerHTML);
            this.r.setProperty(editableElement, 'innerHTML', '');
            this.r.setProperty(editableElement, 'contentEditable', false);
            /** @type {?} */
            const oPre = this.r.createElement('pre');
            this.r.setStyle(oPre, 'margin', '0');
            this.r.setStyle(oPre, 'outline', 'none');
            /** @type {?} */
            const oCode = this.r.createElement('code');
            this.r.setProperty(oCode, 'id', 'sourceText' + this.id);
            this.r.setStyle(oCode, 'display', 'block');
            this.r.setStyle(oCode, 'white-space', 'pre-wrap');
            this.r.setStyle(oCode, 'word-break', 'keep-all');
            this.r.setStyle(oCode, 'outline', 'none');
            this.r.setStyle(oCode, 'margin', '0');
            this.r.setStyle(oCode, 'background-color', '#fff5b9');
            this.r.setProperty(oCode, 'contentEditable', true);
            this.r.appendChild(oCode, oContent);
            this.focusInstance = this.r.listen(oCode, 'focus', (/**
             * @param {?} event
             * @return {?}
             */
            (event) => this.onTextAreaFocus(event)));
            this.blurInstance = this.r.listen(oCode, 'blur', (/**
             * @param {?} event
             * @return {?}
             */
            (event) => this.onTextAreaBlur(event)));
            this.r.appendChild(oPre, oCode);
            this.r.appendChild(editableElement, oPre);
            // ToDo move to service
            this.doc.execCommand('defaultParagraphSeparator', false, 'div');
            this.modeVisual = false;
            this.viewMode.emit(false);
            oCode.focus();
        }
        else {
            if (this.doc.querySelectorAll) {
                this.r.setProperty(editableElement, 'innerHTML', editableElement.innerText);
            }
            else {
                oContent = this.doc.createRange();
                oContent.selectNodeContents(editableElement.firstChild);
                this.r.setProperty(editableElement, 'innerHTML', oContent.toString());
            }
            this.r.setProperty(editableElement, 'contentEditable', true);
            this.modeVisual = true;
            this.viewMode.emit(true);
            this.onContentChange(editableElement.innerHTML);
            editableElement.focus();
        }
        this.editorToolbar.setEditorMode(!this.modeVisual);
    }
    /**
     * toggles editor buttons when cursor moved or positioning
     *
     * Send a node array from the contentEditable of the editor
     * @return {?}
     */
    exec() {
        this.editorToolbar.triggerButtons();
        /** @type {?} */
        let userSelection;
        if (this.doc.getSelection) {
            userSelection = this.doc.getSelection();
            this.editorService.executeInNextQueueIteration(this.editorService.saveSelection);
        }
        /** @type {?} */
        let a = userSelection.focusNode;
        /** @type {?} */
        const els = [];
        while (a && a.id !== 'editor') {
            els.unshift(a);
            a = a.parentNode;
        }
        this.editorToolbar.triggerBlocks(els);
    }
    /**
     * @private
     * @return {?}
     */
    configure() {
        this.editorService.uploadUrl = this.config.uploadUrl;
        if (this.config.defaultParagraphSeparator) {
            this.editorService.setDefaultParagraphSeparator(this.config.defaultParagraphSeparator);
        }
        if (this.config.defaultFontName) {
            this.editorService.setFontName(this.config.defaultFontName);
        }
        if (this.config.defaultFontSize) {
            this.editorService.setFontSize(this.config.defaultFontSize);
        }
    }
    /**
     * @return {?}
     */
    getFonts() {
        /** @type {?} */
        const fonts = this.config.fonts ? this.config.fonts : angularEditorConfig.fonts;
        return fonts.map((/**
         * @param {?} x
         * @return {?}
         */
        x => {
            return { label: x.name, value: x.name };
        }));
    }
    /**
     * @return {?}
     */
    getCustomTags() {
        /** @type {?} */
        const tags = ['span'];
        this.config.customClasses.forEach((/**
         * @param {?} x
         * @return {?}
         */
        x => {
            if (x.tag !== undefined) {
                if (!tags.includes(x.tag)) {
                    tags.push(x.tag);
                }
            }
        }));
        return tags.join(',');
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.blurInstance) {
            this.blurInstance();
        }
        if (this.focusInstance) {
            this.focusInstance();
        }
    }
}
AngularEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'angular-editor',
                template: "<div class=\"angular-editor\" #angularEditor [style.width]=\"config.width\"\r\n     [style.minWidth]=\"config.minWidth\">\r\n  <angular-editor-toolbar *ngIf=\"config.toolbarPosition === 'top'\" #editorToolbar\r\n                          [id]=\"id\"\r\n                          [uploadUrl]=\"config.uploadUrl\"\r\n                          [showToolbar]=\"config.showToolbar !== undefined ? config.showToolbar : true\"\r\n                          [fonts]=\"getFonts()\"\r\n                          [defaultFontName]=\"config.defaultFontName\"\r\n                          [defaultFontSize]=\"config.defaultFontSize\"\r\n                          (execute)=\"executeCommand($event)\"></angular-editor-toolbar>\r\n\r\n  <div class=\"angular-editor-wrapper\" #editorWrapper>\r\n    <div #editor class=\"angular-editor-textarea\"\r\n         [attr.contenteditable]=\"config.editable\"\r\n         [attr.tabintex]=\"disabled ? -1 : tabIndex\"\r\n         [attr.translate]=\"config.translate\"\r\n         [attr.spellcheck]=\"config.spellcheck\"\r\n         [style.height]=\"config.height\"\r\n         [style.minHeight]=\"config.minHeight\"\r\n         [style.maxHeight]=\"config.maxHeight\"\r\n         [style.outline]=\"config.outline === false ? 'none': undefined\"\r\n         (input)=\"onContentChange($event.target.innerHTML)\"\r\n         (focus)=\"onTextAreaFocus($event)\"\r\n         (blur)=\"onTextAreaBlur($event)\"\r\n         (click)=\"exec()\"\r\n         (keyup)=\"exec()\"\r\n         (mouseout)=\"onTextAreaMouseOut($event)\"\r\n    >\r\n    </div>\r\n    <span class=\"angular-editor-placeholder\">{{ placeholder || config['placeholder'] }}</span>\r\n  </div>\r\n  <angular-editor-toolbar *ngIf=\"config.toolbarPosition === 'bottom'\" #editorToolbar\r\n                          [id]=\"id\"\r\n                          [uploadUrl]=\"config.uploadUrl\"\r\n                          [showToolbar]=\"config.showToolbar !== undefined ? config.showToolbar : true\"\r\n                          [fonts]=\"getFonts()\"\r\n                          [defaultFontName]=\"config.defaultFontName\"\r\n                          [defaultFontSize]=\"config.defaultFontSize\"\r\n                          (execute)=\"executeCommand($event)\"></angular-editor-toolbar>\r\n</div>\r\n",
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AngularEditorComponent)),
                        multi: true
                    }
                ],
                styles: ["@charset \"UTF-8\";/*!\n *  Font Awesome 4.7.0 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */@font-face{font-family:FontAwesome;src:url(https://netdna.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.eot?v=4.7.0);src:url(https://netdna.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0) format(\"embedded-opentype\"),url(https://netdna.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0) format(\"woff2\"),url(https://netdna.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0) format(\"woff\"),url(https://netdna.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0) format(\"truetype\"),url(https://netdna.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular) format(\"svg\");font-weight:400;font-style:normal}.fa{display:inline-block;font:14px/1 FontAwesome;font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.fa-lg{font-size:1.3333333333em;line-height:.75em;vertical-align:-15%}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-fw{width:1.2857142857em;text-align:center}.fa-ul{padding-left:0;margin-left:2.1428571429em;list-style-type:none}.fa-ul>li{position:relative}.fa-li{position:absolute;left:-2.1428571429em;width:2.1428571429em;top:.1428571429em;text-align:center}.fa-li.fa-lg{left:-1.8571428571em}.fa-border{padding:.2em .25em .15em;border:.08em solid #eee;border-radius:.1em}.fa-pull-left{float:left}.fa-pull-right{float:right}.fa.fa-pull-left{margin-right:.3em}.fa.fa-pull-right{margin-left:.3em}.pull-right{float:right}.pull-left{float:left}.fa.pull-left{margin-right:.3em}.fa.pull-right{margin-left:.3em}.fa-spin{-webkit-animation:2s linear infinite fa-spin;animation:2s linear infinite fa-spin}.fa-pulse{-webkit-animation:1s steps(8) infinite fa-spin;animation:1s steps(8) infinite fa-spin}@-webkit-keyframes fa-spin{0%{transform:rotate(0)}100%{transform:rotate(359deg)}}@keyframes fa-spin{0%{transform:rotate(0)}100%{transform:rotate(359deg)}}.fa-rotate-90{transform:rotate(90deg)}.fa-rotate-180{transform:rotate(180deg)}.fa-rotate-270{transform:rotate(270deg)}.fa-flip-horizontal{transform:scale(-1,1)}.fa-flip-vertical{transform:scale(1,-1)}:root .fa-flip-horizontal,:root .fa-flip-vertical,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-rotate-90{-webkit-filter:none;filter:none}.fa-stack{position:relative;display:inline-block;width:2em;height:2em;line-height:2em;vertical-align:middle}.fa-stack-1x,.fa-stack-2x{position:absolute;left:0;width:100%;text-align:center}.fa-stack-1x{line-height:inherit}.fa-stack-2x{font-size:2em}.fa-inverse{color:#fff}.fa-glass:before{content:\"\uF000\"}.fa-music:before{content:\"\uF001\"}.fa-search:before{content:\"\uF002\"}.fa-envelope-o:before{content:\"\uF003\"}.fa-heart:before{content:\"\uF004\"}.fa-star:before{content:\"\uF005\"}.fa-star-o:before{content:\"\uF006\"}.fa-user:before{content:\"\uF007\"}.fa-film:before{content:\"\uF008\"}.fa-th-large:before{content:\"\uF009\"}.fa-th:before{content:\"\uF00A\"}.fa-th-list:before{content:\"\uF00B\"}.fa-check:before{content:\"\uF00C\"}.fa-close:before,.fa-remove:before,.fa-times:before{content:\"\uF00D\"}.fa-search-plus:before{content:\"\uF00E\"}.fa-search-minus:before{content:\"\uF010\"}.fa-power-off:before{content:\"\uF011\"}.fa-signal:before{content:\"\uF012\"}.fa-cog:before,.fa-gear:before{content:\"\uF013\"}.fa-trash-o:before{content:\"\uF014\"}.fa-home:before{content:\"\uF015\"}.fa-file-o:before{content:\"\uF016\"}.fa-clock-o:before{content:\"\uF017\"}.fa-road:before{content:\"\uF018\"}.fa-download:before{content:\"\uF019\"}.fa-arrow-circle-o-down:before{content:\"\uF01A\"}.fa-arrow-circle-o-up:before{content:\"\uF01B\"}.fa-inbox:before{content:\"\uF01C\"}.fa-play-circle-o:before{content:\"\uF01D\"}.fa-repeat:before,.fa-rotate-right:before{content:\"\uF01E\"}.fa-refresh:before{content:\"\uF021\"}.fa-list-alt:before{content:\"\uF022\"}.fa-lock:before{content:\"\uF023\"}.fa-flag:before{content:\"\uF024\"}.fa-headphones:before{content:\"\uF025\"}.fa-volume-off:before{content:\"\uF026\"}.fa-volume-down:before{content:\"\uF027\"}.fa-volume-up:before{content:\"\uF028\"}.fa-qrcode:before{content:\"\uF029\"}.fa-barcode:before{content:\"\uF02A\"}.fa-tag:before{content:\"\uF02B\"}.fa-tags:before{content:\"\uF02C\"}.fa-book:before{content:\"\uF02D\"}.fa-bookmark:before{content:\"\uF02E\"}.fa-print:before{content:\"\uF02F\"}.fa-camera:before{content:\"\uF030\"}.fa-font:before{content:\"\uF031\"}.fa-bold:before{content:\"\uF032\"}.fa-italic:before{content:\"\uF033\"}.fa-text-height:before{content:\"\uF034\"}.fa-text-width:before{content:\"\uF035\"}.fa-align-left:before{content:\"\uF036\"}.fa-align-center:before{content:\"\uF037\"}.fa-align-right:before{content:\"\uF038\"}.fa-align-justify:before{content:\"\uF039\"}.fa-list:before{content:\"\uF03A\"}.fa-dedent:before,.fa-outdent:before{content:\"\uF03B\"}.fa-indent:before{content:\"\uF03C\"}.fa-video-camera:before{content:\"\uF03D\"}.fa-image:before,.fa-photo:before,.fa-picture-o:before{content:\"\uF03E\"}.fa-pencil:before{content:\"\uF040\"}.fa-map-marker:before{content:\"\uF041\"}.fa-adjust:before{content:\"\uF042\"}.fa-tint:before{content:\"\uF043\"}.fa-edit:before,.fa-pencil-square-o:before{content:\"\uF044\"}.fa-share-square-o:before{content:\"\uF045\"}.fa-check-square-o:before{content:\"\uF046\"}.fa-arrows:before{content:\"\uF047\"}.fa-step-backward:before{content:\"\uF048\"}.fa-fast-backward:before{content:\"\uF049\"}.fa-backward:before{content:\"\uF04A\"}.fa-play:before{content:\"\uF04B\"}.fa-pause:before{content:\"\uF04C\"}.fa-stop:before{content:\"\uF04D\"}.fa-forward:before{content:\"\uF04E\"}.fa-fast-forward:before{content:\"\uF050\"}.fa-step-forward:before{content:\"\uF051\"}.fa-eject:before{content:\"\uF052\"}.fa-chevron-left:before{content:\"\uF053\"}.fa-chevron-right:before{content:\"\uF054\"}.fa-plus-circle:before{content:\"\uF055\"}.fa-minus-circle:before{content:\"\uF056\"}.fa-times-circle:before{content:\"\uF057\"}.fa-check-circle:before{content:\"\uF058\"}.fa-question-circle:before{content:\"\uF059\"}.fa-info-circle:before{content:\"\uF05A\"}.fa-crosshairs:before{content:\"\uF05B\"}.fa-times-circle-o:before{content:\"\uF05C\"}.fa-check-circle-o:before{content:\"\uF05D\"}.fa-ban:before{content:\"\uF05E\"}.fa-arrow-left:before{content:\"\uF060\"}.fa-arrow-right:before{content:\"\uF061\"}.fa-arrow-up:before{content:\"\uF062\"}.fa-arrow-down:before{content:\"\uF063\"}.fa-mail-forward:before,.fa-share:before{content:\"\uF064\"}.fa-expand:before{content:\"\uF065\"}.fa-compress:before{content:\"\uF066\"}.fa-plus:before{content:\"\uF067\"}.fa-minus:before{content:\"\uF068\"}.fa-asterisk:before{content:\"\uF069\"}.fa-exclamation-circle:before{content:\"\uF06A\"}.fa-gift:before{content:\"\uF06B\"}.fa-leaf:before{content:\"\uF06C\"}.fa-fire:before{content:\"\uF06D\"}.fa-eye:before{content:\"\uF06E\"}.fa-eye-slash:before{content:\"\uF070\"}.fa-exclamation-triangle:before,.fa-warning:before{content:\"\uF071\"}.fa-plane:before{content:\"\uF072\"}.fa-calendar:before{content:\"\uF073\"}.fa-random:before{content:\"\uF074\"}.fa-comment:before{content:\"\uF075\"}.fa-magnet:before{content:\"\uF076\"}.fa-chevron-up:before{content:\"\uF077\"}.fa-chevron-down:before{content:\"\uF078\"}.fa-retweet:before{content:\"\uF079\"}.fa-shopping-cart:before{content:\"\uF07A\"}.fa-folder:before{content:\"\uF07B\"}.fa-folder-open:before{content:\"\uF07C\"}.fa-arrows-v:before{content:\"\uF07D\"}.fa-arrows-h:before{content:\"\uF07E\"}.fa-bar-chart-o:before,.fa-bar-chart:before{content:\"\uF080\"}.fa-twitter-square:before{content:\"\uF081\"}.fa-facebook-square:before{content:\"\uF082\"}.fa-camera-retro:before{content:\"\uF083\"}.fa-key:before{content:\"\uF084\"}.fa-cogs:before,.fa-gears:before{content:\"\uF085\"}.fa-comments:before{content:\"\uF086\"}.fa-thumbs-o-up:before{content:\"\uF087\"}.fa-thumbs-o-down:before{content:\"\uF088\"}.fa-star-half:before{content:\"\uF089\"}.fa-heart-o:before{content:\"\uF08A\"}.fa-sign-out:before{content:\"\uF08B\"}.fa-linkedin-square:before{content:\"\uF08C\"}.fa-thumb-tack:before{content:\"\uF08D\"}.fa-external-link:before{content:\"\uF08E\"}.fa-sign-in:before{content:\"\uF090\"}.fa-trophy:before{content:\"\uF091\"}.fa-github-square:before{content:\"\uF092\"}.fa-upload:before{content:\"\uF093\"}.fa-lemon-o:before{content:\"\uF094\"}.fa-phone:before{content:\"\uF095\"}.fa-square-o:before{content:\"\uF096\"}.fa-bookmark-o:before{content:\"\uF097\"}.fa-phone-square:before{content:\"\uF098\"}.fa-twitter:before{content:\"\uF099\"}.fa-facebook-f:before,.fa-facebook:before{content:\"\uF09A\"}.fa-github:before{content:\"\uF09B\"}.fa-unlock:before{content:\"\uF09C\"}.fa-credit-card:before{content:\"\uF09D\"}.fa-feed:before,.fa-rss:before{content:\"\uF09E\"}.fa-hdd-o:before{content:\"\uF0A0\"}.fa-bullhorn:before{content:\"\uF0A1\"}.fa-bell:before{content:\"\uF0F3\"}.fa-certificate:before{content:\"\uF0A3\"}.fa-hand-o-right:before{content:\"\uF0A4\"}.fa-hand-o-left:before{content:\"\uF0A5\"}.fa-hand-o-up:before{content:\"\uF0A6\"}.fa-hand-o-down:before{content:\"\uF0A7\"}.fa-arrow-circle-left:before{content:\"\uF0A8\"}.fa-arrow-circle-right:before{content:\"\uF0A9\"}.fa-arrow-circle-up:before{content:\"\uF0AA\"}.fa-arrow-circle-down:before{content:\"\uF0AB\"}.fa-globe:before{content:\"\uF0AC\"}.fa-wrench:before{content:\"\uF0AD\"}.fa-tasks:before{content:\"\uF0AE\"}.fa-filter:before{content:\"\uF0B0\"}.fa-briefcase:before{content:\"\uF0B1\"}.fa-arrows-alt:before{content:\"\uF0B2\"}.fa-group:before,.fa-users:before{content:\"\uF0C0\"}.fa-chain:before,.fa-link:before{content:\"\uF0C1\"}.fa-cloud:before{content:\"\uF0C2\"}.fa-flask:before{content:\"\uF0C3\"}.fa-cut:before,.fa-scissors:before{content:\"\uF0C4\"}.fa-copy:before,.fa-files-o:before{content:\"\uF0C5\"}.fa-paperclip:before{content:\"\uF0C6\"}.fa-floppy-o:before,.fa-save:before{content:\"\uF0C7\"}.fa-square:before{content:\"\uF0C8\"}.fa-bars:before,.fa-navicon:before,.fa-reorder:before{content:\"\uF0C9\"}.fa-list-ul:before{content:\"\uF0CA\"}.fa-list-ol:before{content:\"\uF0CB\"}.fa-strikethrough:before{content:\"\uF0CC\"}.fa-underline:before{content:\"\uF0CD\"}.fa-table:before{content:\"\uF0CE\"}.fa-magic:before{content:\"\uF0D0\"}.fa-truck:before{content:\"\uF0D1\"}.fa-pinterest:before{content:\"\uF0D2\"}.fa-pinterest-square:before{content:\"\uF0D3\"}.fa-google-plus-square:before{content:\"\uF0D4\"}.fa-google-plus:before{content:\"\uF0D5\"}.fa-money:before{content:\"\uF0D6\"}.fa-caret-down:before{content:\"\uF0D7\"}.fa-caret-up:before{content:\"\uF0D8\"}.fa-caret-left:before{content:\"\uF0D9\"}.fa-caret-right:before{content:\"\uF0DA\"}.fa-columns:before{content:\"\uF0DB\"}.fa-sort:before,.fa-unsorted:before{content:\"\uF0DC\"}.fa-sort-desc:before,.fa-sort-down:before{content:\"\uF0DD\"}.fa-sort-asc:before,.fa-sort-up:before{content:\"\uF0DE\"}.fa-envelope:before{content:\"\uF0E0\"}.fa-linkedin:before{content:\"\uF0E1\"}.fa-rotate-left:before,.fa-undo:before{content:\"\uF0E2\"}.fa-gavel:before,.fa-legal:before{content:\"\uF0E3\"}.fa-dashboard:before,.fa-tachometer:before{content:\"\uF0E4\"}.fa-comment-o:before{content:\"\uF0E5\"}.fa-comments-o:before{content:\"\uF0E6\"}.fa-bolt:before,.fa-flash:before{content:\"\uF0E7\"}.fa-sitemap:before{content:\"\uF0E8\"}.fa-umbrella:before{content:\"\uF0E9\"}.fa-clipboard:before,.fa-paste:before{content:\"\uF0EA\"}.fa-lightbulb-o:before{content:\"\uF0EB\"}.fa-exchange:before{content:\"\uF0EC\"}.fa-cloud-download:before{content:\"\uF0ED\"}.fa-cloud-upload:before{content:\"\uF0EE\"}.fa-user-md:before{content:\"\uF0F0\"}.fa-stethoscope:before{content:\"\uF0F1\"}.fa-suitcase:before{content:\"\uF0F2\"}.fa-bell-o:before{content:\"\uF0A2\"}.fa-coffee:before{content:\"\uF0F4\"}.fa-cutlery:before{content:\"\uF0F5\"}.fa-file-text-o:before{content:\"\uF0F6\"}.fa-building-o:before{content:\"\uF0F7\"}.fa-hospital-o:before{content:\"\uF0F8\"}.fa-ambulance:before{content:\"\uF0F9\"}.fa-medkit:before{content:\"\uF0FA\"}.fa-fighter-jet:before{content:\"\uF0FB\"}.fa-beer:before{content:\"\uF0FC\"}.fa-h-square:before{content:\"\uF0FD\"}.fa-plus-square:before{content:\"\uF0FE\"}.fa-angle-double-left:before{content:\"\uF100\"}.fa-angle-double-right:before{content:\"\uF101\"}.fa-angle-double-up:before{content:\"\uF102\"}.fa-angle-double-down:before{content:\"\uF103\"}.fa-angle-left:before{content:\"\uF104\"}.fa-angle-right:before{content:\"\uF105\"}.fa-angle-up:before{content:\"\uF106\"}.fa-angle-down:before{content:\"\uF107\"}.fa-desktop:before{content:\"\uF108\"}.fa-laptop:before{content:\"\uF109\"}.fa-tablet:before{content:\"\uF10A\"}.fa-mobile-phone:before,.fa-mobile:before{content:\"\uF10B\"}.fa-circle-o:before{content:\"\uF10C\"}.fa-quote-left:before{content:\"\uF10D\"}.fa-quote-right:before{content:\"\uF10E\"}.fa-spinner:before{content:\"\uF110\"}.fa-circle:before{content:\"\uF111\"}.fa-mail-reply:before,.fa-reply:before{content:\"\uF112\"}.fa-github-alt:before{content:\"\uF113\"}.fa-folder-o:before{content:\"\uF114\"}.fa-folder-open-o:before{content:\"\uF115\"}.fa-smile-o:before{content:\"\uF118\"}.fa-frown-o:before{content:\"\uF119\"}.fa-meh-o:before{content:\"\uF11A\"}.fa-gamepad:before{content:\"\uF11B\"}.fa-keyboard-o:before{content:\"\uF11C\"}.fa-flag-o:before{content:\"\uF11D\"}.fa-flag-checkered:before{content:\"\uF11E\"}.fa-terminal:before{content:\"\uF120\"}.fa-code:before{content:\"\uF121\"}.fa-mail-reply-all:before,.fa-reply-all:before{content:\"\uF122\"}.fa-star-half-empty:before,.fa-star-half-full:before,.fa-star-half-o:before{content:\"\uF123\"}.fa-location-arrow:before{content:\"\uF124\"}.fa-crop:before{content:\"\uF125\"}.fa-code-fork:before{content:\"\uF126\"}.fa-chain-broken:before,.fa-unlink:before{content:\"\uF127\"}.fa-question:before{content:\"\uF128\"}.fa-info:before{content:\"\uF129\"}.fa-exclamation:before{content:\"\uF12A\"}.fa-superscript:before{content:\"\uF12B\"}.fa-subscript:before{content:\"\uF12C\"}.fa-eraser:before{content:\"\uF12D\"}.fa-puzzle-piece:before{content:\"\uF12E\"}.fa-microphone:before{content:\"\uF130\"}.fa-microphone-slash:before{content:\"\uF131\"}.fa-shield:before{content:\"\uF132\"}.fa-calendar-o:before{content:\"\uF133\"}.fa-fire-extinguisher:before{content:\"\uF134\"}.fa-rocket:before{content:\"\uF135\"}.fa-maxcdn:before{content:\"\uF136\"}.fa-chevron-circle-left:before{content:\"\uF137\"}.fa-chevron-circle-right:before{content:\"\uF138\"}.fa-chevron-circle-up:before{content:\"\uF139\"}.fa-chevron-circle-down:before{content:\"\uF13A\"}.fa-html5:before{content:\"\uF13B\"}.fa-css3:before{content:\"\uF13C\"}.fa-anchor:before{content:\"\uF13D\"}.fa-unlock-alt:before{content:\"\uF13E\"}.fa-bullseye:before{content:\"\uF140\"}.fa-ellipsis-h:before{content:\"\uF141\"}.fa-ellipsis-v:before{content:\"\uF142\"}.fa-rss-square:before{content:\"\uF143\"}.fa-play-circle:before{content:\"\uF144\"}.fa-ticket:before{content:\"\uF145\"}.fa-minus-square:before{content:\"\uF146\"}.fa-minus-square-o:before{content:\"\uF147\"}.fa-level-up:before{content:\"\uF148\"}.fa-level-down:before{content:\"\uF149\"}.fa-check-square:before{content:\"\uF14A\"}.fa-pencil-square:before{content:\"\uF14B\"}.fa-external-link-square:before{content:\"\uF14C\"}.fa-share-square:before{content:\"\uF14D\"}.fa-compass:before{content:\"\uF14E\"}.fa-caret-square-o-down:before,.fa-toggle-down:before{content:\"\uF150\"}.fa-caret-square-o-up:before,.fa-toggle-up:before{content:\"\uF151\"}.fa-caret-square-o-right:before,.fa-toggle-right:before{content:\"\uF152\"}.fa-eur:before,.fa-euro:before{content:\"\uF153\"}.fa-gbp:before{content:\"\uF154\"}.fa-dollar:before,.fa-usd:before{content:\"\uF155\"}.fa-inr:before,.fa-rupee:before{content:\"\uF156\"}.fa-cny:before,.fa-jpy:before,.fa-rmb:before,.fa-yen:before{content:\"\uF157\"}.fa-rouble:before,.fa-rub:before,.fa-ruble:before{content:\"\uF158\"}.fa-krw:before,.fa-won:before{content:\"\uF159\"}.fa-bitcoin:before,.fa-btc:before{content:\"\uF15A\"}.fa-file:before{content:\"\uF15B\"}.fa-file-text:before{content:\"\uF15C\"}.fa-sort-alpha-asc:before{content:\"\uF15D\"}.fa-sort-alpha-desc:before{content:\"\uF15E\"}.fa-sort-amount-asc:before{content:\"\uF160\"}.fa-sort-amount-desc:before{content:\"\uF161\"}.fa-sort-numeric-asc:before{content:\"\uF162\"}.fa-sort-numeric-desc:before{content:\"\uF163\"}.fa-thumbs-up:before{content:\"\uF164\"}.fa-thumbs-down:before{content:\"\uF165\"}.fa-youtube-square:before{content:\"\uF166\"}.fa-youtube:before{content:\"\uF167\"}.fa-xing:before{content:\"\uF168\"}.fa-xing-square:before{content:\"\uF169\"}.fa-youtube-play:before{content:\"\uF16A\"}.fa-dropbox:before{content:\"\uF16B\"}.fa-stack-overflow:before{content:\"\uF16C\"}.fa-instagram:before{content:\"\uF16D\"}.fa-flickr:before{content:\"\uF16E\"}.fa-adn:before{content:\"\uF170\"}.fa-bitbucket:before{content:\"\uF171\"}.fa-bitbucket-square:before{content:\"\uF172\"}.fa-tumblr:before{content:\"\uF173\"}.fa-tumblr-square:before{content:\"\uF174\"}.fa-long-arrow-down:before{content:\"\uF175\"}.fa-long-arrow-up:before{content:\"\uF176\"}.fa-long-arrow-left:before{content:\"\uF177\"}.fa-long-arrow-right:before{content:\"\uF178\"}.fa-apple:before{content:\"\uF179\"}.fa-windows:before{content:\"\uF17A\"}.fa-android:before{content:\"\uF17B\"}.fa-linux:before{content:\"\uF17C\"}.fa-dribbble:before{content:\"\uF17D\"}.fa-skype:before{content:\"\uF17E\"}.fa-foursquare:before{content:\"\uF180\"}.fa-trello:before{content:\"\uF181\"}.fa-female:before{content:\"\uF182\"}.fa-male:before{content:\"\uF183\"}.fa-gittip:before,.fa-gratipay:before{content:\"\uF184\"}.fa-sun-o:before{content:\"\uF185\"}.fa-moon-o:before{content:\"\uF186\"}.fa-archive:before{content:\"\uF187\"}.fa-bug:before{content:\"\uF188\"}.fa-vk:before{content:\"\uF189\"}.fa-weibo:before{content:\"\uF18A\"}.fa-renren:before{content:\"\uF18B\"}.fa-pagelines:before{content:\"\uF18C\"}.fa-stack-exchange:before{content:\"\uF18D\"}.fa-arrow-circle-o-right:before{content:\"\uF18E\"}.fa-arrow-circle-o-left:before{content:\"\uF190\"}.fa-caret-square-o-left:before,.fa-toggle-left:before{content:\"\uF191\"}.fa-dot-circle-o:before{content:\"\uF192\"}.fa-wheelchair:before{content:\"\uF193\"}.fa-vimeo-square:before{content:\"\uF194\"}.fa-try:before,.fa-turkish-lira:before{content:\"\uF195\"}.fa-plus-square-o:before{content:\"\uF196\"}.fa-space-shuttle:before{content:\"\uF197\"}.fa-slack:before{content:\"\uF198\"}.fa-envelope-square:before{content:\"\uF199\"}.fa-wordpress:before{content:\"\uF19A\"}.fa-openid:before{content:\"\uF19B\"}.fa-bank:before,.fa-institution:before,.fa-university:before{content:\"\uF19C\"}.fa-graduation-cap:before,.fa-mortar-board:before{content:\"\uF19D\"}.fa-yahoo:before{content:\"\uF19E\"}.fa-google:before{content:\"\uF1A0\"}.fa-reddit:before{content:\"\uF1A1\"}.fa-reddit-square:before{content:\"\uF1A2\"}.fa-stumbleupon-circle:before{content:\"\uF1A3\"}.fa-stumbleupon:before{content:\"\uF1A4\"}.fa-delicious:before{content:\"\uF1A5\"}.fa-digg:before{content:\"\uF1A6\"}.fa-pied-piper-pp:before{content:\"\uF1A7\"}.fa-pied-piper-alt:before{content:\"\uF1A8\"}.fa-drupal:before{content:\"\uF1A9\"}.fa-joomla:before{content:\"\uF1AA\"}.fa-language:before{content:\"\uF1AB\"}.fa-fax:before{content:\"\uF1AC\"}.fa-building:before{content:\"\uF1AD\"}.fa-child:before{content:\"\uF1AE\"}.fa-paw:before{content:\"\uF1B0\"}.fa-spoon:before{content:\"\uF1B1\"}.fa-cube:before{content:\"\uF1B2\"}.fa-cubes:before{content:\"\uF1B3\"}.fa-behance:before{content:\"\uF1B4\"}.fa-behance-square:before{content:\"\uF1B5\"}.fa-steam:before{content:\"\uF1B6\"}.fa-steam-square:before{content:\"\uF1B7\"}.fa-recycle:before{content:\"\uF1B8\"}.fa-automobile:before,.fa-car:before{content:\"\uF1B9\"}.fa-cab:before,.fa-taxi:before{content:\"\uF1BA\"}.fa-tree:before{content:\"\uF1BB\"}.fa-spotify:before{content:\"\uF1BC\"}.fa-deviantart:before{content:\"\uF1BD\"}.fa-soundcloud:before{content:\"\uF1BE\"}.fa-database:before{content:\"\uF1C0\"}.fa-file-pdf-o:before{content:\"\uF1C1\"}.fa-file-word-o:before{content:\"\uF1C2\"}.fa-file-excel-o:before{content:\"\uF1C3\"}.fa-file-powerpoint-o:before{content:\"\uF1C4\"}.fa-file-image-o:before,.fa-file-photo-o:before,.fa-file-picture-o:before{content:\"\uF1C5\"}.fa-file-archive-o:before,.fa-file-zip-o:before{content:\"\uF1C6\"}.fa-file-audio-o:before,.fa-file-sound-o:before{content:\"\uF1C7\"}.fa-file-movie-o:before,.fa-file-video-o:before{content:\"\uF1C8\"}.fa-file-code-o:before{content:\"\uF1C9\"}.fa-vine:before{content:\"\uF1CA\"}.fa-codepen:before{content:\"\uF1CB\"}.fa-jsfiddle:before{content:\"\uF1CC\"}.fa-life-bouy:before,.fa-life-buoy:before,.fa-life-ring:before,.fa-life-saver:before,.fa-support:before{content:\"\uF1CD\"}.fa-circle-o-notch:before{content:\"\uF1CE\"}.fa-ra:before,.fa-rebel:before,.fa-resistance:before{content:\"\uF1D0\"}.fa-empire:before,.fa-ge:before{content:\"\uF1D1\"}.fa-git-square:before{content:\"\uF1D2\"}.fa-git:before{content:\"\uF1D3\"}.fa-hacker-news:before,.fa-y-combinator-square:before,.fa-yc-square:before{content:\"\uF1D4\"}.fa-tencent-weibo:before{content:\"\uF1D5\"}.fa-qq:before{content:\"\uF1D6\"}.fa-wechat:before,.fa-weixin:before{content:\"\uF1D7\"}.fa-paper-plane:before,.fa-send:before{content:\"\uF1D8\"}.fa-paper-plane-o:before,.fa-send-o:before{content:\"\uF1D9\"}.fa-history:before{content:\"\uF1DA\"}.fa-circle-thin:before{content:\"\uF1DB\"}.fa-header:before{content:\"\uF1DC\"}.fa-paragraph:before{content:\"\uF1DD\"}.fa-sliders:before{content:\"\uF1DE\"}.fa-share-alt:before{content:\"\uF1E0\"}.fa-share-alt-square:before{content:\"\uF1E1\"}.fa-bomb:before{content:\"\uF1E2\"}.fa-futbol-o:before,.fa-soccer-ball-o:before{content:\"\uF1E3\"}.fa-tty:before{content:\"\uF1E4\"}.fa-binoculars:before{content:\"\uF1E5\"}.fa-plug:before{content:\"\uF1E6\"}.fa-slideshare:before{content:\"\uF1E7\"}.fa-twitch:before{content:\"\uF1E8\"}.fa-yelp:before{content:\"\uF1E9\"}.fa-newspaper-o:before{content:\"\uF1EA\"}.fa-wifi:before{content:\"\uF1EB\"}.fa-calculator:before{content:\"\uF1EC\"}.fa-paypal:before{content:\"\uF1ED\"}.fa-google-wallet:before{content:\"\uF1EE\"}.fa-cc-visa:before{content:\"\uF1F0\"}.fa-cc-mastercard:before{content:\"\uF1F1\"}.fa-cc-discover:before{content:\"\uF1F2\"}.fa-cc-amex:before{content:\"\uF1F3\"}.fa-cc-paypal:before{content:\"\uF1F4\"}.fa-cc-stripe:before{content:\"\uF1F5\"}.fa-bell-slash:before{content:\"\uF1F6\"}.fa-bell-slash-o:before{content:\"\uF1F7\"}.fa-trash:before{content:\"\uF1F8\"}.fa-copyright:before{content:\"\uF1F9\"}.fa-at:before{content:\"\uF1FA\"}.fa-eyedropper:before{content:\"\uF1FB\"}.fa-paint-brush:before{content:\"\uF1FC\"}.fa-birthday-cake:before{content:\"\uF1FD\"}.fa-area-chart:before{content:\"\uF1FE\"}.fa-pie-chart:before{content:\"\uF200\"}.fa-line-chart:before{content:\"\uF201\"}.fa-lastfm:before{content:\"\uF202\"}.fa-lastfm-square:before{content:\"\uF203\"}.fa-toggle-off:before{content:\"\uF204\"}.fa-toggle-on:before{content:\"\uF205\"}.fa-bicycle:before{content:\"\uF206\"}.fa-bus:before{content:\"\uF207\"}.fa-ioxhost:before{content:\"\uF208\"}.fa-angellist:before{content:\"\uF209\"}.fa-cc:before{content:\"\uF20A\"}.fa-ils:before,.fa-shekel:before,.fa-sheqel:before{content:\"\uF20B\"}.fa-meanpath:before{content:\"\uF20C\"}.fa-buysellads:before{content:\"\uF20D\"}.fa-connectdevelop:before{content:\"\uF20E\"}.fa-dashcube:before{content:\"\uF210\"}.fa-forumbee:before{content:\"\uF211\"}.fa-leanpub:before{content:\"\uF212\"}.fa-sellsy:before{content:\"\uF213\"}.fa-shirtsinbulk:before{content:\"\uF214\"}.fa-simplybuilt:before{content:\"\uF215\"}.fa-skyatlas:before{content:\"\uF216\"}.fa-cart-plus:before{content:\"\uF217\"}.fa-cart-arrow-down:before{content:\"\uF218\"}.fa-diamond:before{content:\"\uF219\"}.fa-ship:before{content:\"\uF21A\"}.fa-user-secret:before{content:\"\uF21B\"}.fa-motorcycle:before{content:\"\uF21C\"}.fa-street-view:before{content:\"\uF21D\"}.fa-heartbeat:before{content:\"\uF21E\"}.fa-venus:before{content:\"\uF221\"}.fa-mars:before{content:\"\uF222\"}.fa-mercury:before{content:\"\uF223\"}.fa-intersex:before,.fa-transgender:before{content:\"\uF224\"}.fa-transgender-alt:before{content:\"\uF225\"}.fa-venus-double:before{content:\"\uF226\"}.fa-mars-double:before{content:\"\uF227\"}.fa-venus-mars:before{content:\"\uF228\"}.fa-mars-stroke:before{content:\"\uF229\"}.fa-mars-stroke-v:before{content:\"\uF22A\"}.fa-mars-stroke-h:before{content:\"\uF22B\"}.fa-neuter:before{content:\"\uF22C\"}.fa-genderless:before{content:\"\uF22D\"}.fa-facebook-official:before{content:\"\uF230\"}.fa-pinterest-p:before{content:\"\uF231\"}.fa-whatsapp:before{content:\"\uF232\"}.fa-server:before{content:\"\uF233\"}.fa-user-plus:before{content:\"\uF234\"}.fa-user-times:before{content:\"\uF235\"}.fa-bed:before,.fa-hotel:before{content:\"\uF236\"}.fa-viacoin:before{content:\"\uF237\"}.fa-train:before{content:\"\uF238\"}.fa-subway:before{content:\"\uF239\"}.fa-medium:before{content:\"\uF23A\"}.fa-y-combinator:before,.fa-yc:before{content:\"\uF23B\"}.fa-optin-monster:before{content:\"\uF23C\"}.fa-opencart:before{content:\"\uF23D\"}.fa-expeditedssl:before{content:\"\uF23E\"}.fa-battery-4:before,.fa-battery-full:before,.fa-battery:before{content:\"\uF240\"}.fa-battery-3:before,.fa-battery-three-quarters:before{content:\"\uF241\"}.fa-battery-2:before,.fa-battery-half:before{content:\"\uF242\"}.fa-battery-1:before,.fa-battery-quarter:before{content:\"\uF243\"}.fa-battery-0:before,.fa-battery-empty:before{content:\"\uF244\"}.fa-mouse-pointer:before{content:\"\uF245\"}.fa-i-cursor:before{content:\"\uF246\"}.fa-object-group:before{content:\"\uF247\"}.fa-object-ungroup:before{content:\"\uF248\"}.fa-sticky-note:before{content:\"\uF249\"}.fa-sticky-note-o:before{content:\"\uF24A\"}.fa-cc-jcb:before{content:\"\uF24B\"}.fa-cc-diners-club:before{content:\"\uF24C\"}.fa-clone:before{content:\"\uF24D\"}.fa-balance-scale:before{content:\"\uF24E\"}.fa-hourglass-o:before{content:\"\uF250\"}.fa-hourglass-1:before,.fa-hourglass-start:before{content:\"\uF251\"}.fa-hourglass-2:before,.fa-hourglass-half:before{content:\"\uF252\"}.fa-hourglass-3:before,.fa-hourglass-end:before{content:\"\uF253\"}.fa-hourglass:before{content:\"\uF254\"}.fa-hand-grab-o:before,.fa-hand-rock-o:before{content:\"\uF255\"}.fa-hand-paper-o:before,.fa-hand-stop-o:before{content:\"\uF256\"}.fa-hand-scissors-o:before{content:\"\uF257\"}.fa-hand-lizard-o:before{content:\"\uF258\"}.fa-hand-spock-o:before{content:\"\uF259\"}.fa-hand-pointer-o:before{content:\"\uF25A\"}.fa-hand-peace-o:before{content:\"\uF25B\"}.fa-trademark:before{content:\"\uF25C\"}.fa-registered:before{content:\"\uF25D\"}.fa-creative-commons:before{content:\"\uF25E\"}.fa-gg:before{content:\"\uF260\"}.fa-gg-circle:before{content:\"\uF261\"}.fa-tripadvisor:before{content:\"\uF262\"}.fa-odnoklassniki:before{content:\"\uF263\"}.fa-odnoklassniki-square:before{content:\"\uF264\"}.fa-get-pocket:before{content:\"\uF265\"}.fa-wikipedia-w:before{content:\"\uF266\"}.fa-safari:before{content:\"\uF267\"}.fa-chrome:before{content:\"\uF268\"}.fa-firefox:before{content:\"\uF269\"}.fa-opera:before{content:\"\uF26A\"}.fa-internet-explorer:before{content:\"\uF26B\"}.fa-television:before,.fa-tv:before{content:\"\uF26C\"}.fa-contao:before{content:\"\uF26D\"}.fa-500px:before{content:\"\uF26E\"}.fa-amazon:before{content:\"\uF270\"}.fa-calendar-plus-o:before{content:\"\uF271\"}.fa-calendar-minus-o:before{content:\"\uF272\"}.fa-calendar-times-o:before{content:\"\uF273\"}.fa-calendar-check-o:before{content:\"\uF274\"}.fa-industry:before{content:\"\uF275\"}.fa-map-pin:before{content:\"\uF276\"}.fa-map-signs:before{content:\"\uF277\"}.fa-map-o:before{content:\"\uF278\"}.fa-map:before{content:\"\uF279\"}.fa-commenting:before{content:\"\uF27A\"}.fa-commenting-o:before{content:\"\uF27B\"}.fa-houzz:before{content:\"\uF27C\"}.fa-vimeo:before{content:\"\uF27D\"}.fa-black-tie:before{content:\"\uF27E\"}.fa-fonticons:before{content:\"\uF280\"}.fa-reddit-alien:before{content:\"\uF281\"}.fa-edge:before{content:\"\uF282\"}.fa-credit-card-alt:before{content:\"\uF283\"}.fa-codiepie:before{content:\"\uF284\"}.fa-modx:before{content:\"\uF285\"}.fa-fort-awesome:before{content:\"\uF286\"}.fa-usb:before{content:\"\uF287\"}.fa-product-hunt:before{content:\"\uF288\"}.fa-mixcloud:before{content:\"\uF289\"}.fa-scribd:before{content:\"\uF28A\"}.fa-pause-circle:before{content:\"\uF28B\"}.fa-pause-circle-o:before{content:\"\uF28C\"}.fa-stop-circle:before{content:\"\uF28D\"}.fa-stop-circle-o:before{content:\"\uF28E\"}.fa-shopping-bag:before{content:\"\uF290\"}.fa-shopping-basket:before{content:\"\uF291\"}.fa-hashtag:before{content:\"\uF292\"}.fa-bluetooth:before{content:\"\uF293\"}.fa-bluetooth-b:before{content:\"\uF294\"}.fa-percent:before{content:\"\uF295\"}.fa-gitlab:before{content:\"\uF296\"}.fa-wpbeginner:before{content:\"\uF297\"}.fa-wpforms:before{content:\"\uF298\"}.fa-envira:before{content:\"\uF299\"}.fa-universal-access:before{content:\"\uF29A\"}.fa-wheelchair-alt:before{content:\"\uF29B\"}.fa-question-circle-o:before{content:\"\uF29C\"}.fa-blind:before{content:\"\uF29D\"}.fa-audio-description:before{content:\"\uF29E\"}.fa-volume-control-phone:before{content:\"\uF2A0\"}.fa-braille:before{content:\"\uF2A1\"}.fa-assistive-listening-systems:before{content:\"\uF2A2\"}.fa-american-sign-language-interpreting:before,.fa-asl-interpreting:before{content:\"\uF2A3\"}.fa-deaf:before,.fa-deafness:before,.fa-hard-of-hearing:before{content:\"\uF2A4\"}.fa-glide:before{content:\"\uF2A5\"}.fa-glide-g:before{content:\"\uF2A6\"}.fa-sign-language:before,.fa-signing:before{content:\"\uF2A7\"}.fa-low-vision:before{content:\"\uF2A8\"}.fa-viadeo:before{content:\"\uF2A9\"}.fa-viadeo-square:before{content:\"\uF2AA\"}.fa-snapchat:before{content:\"\uF2AB\"}.fa-snapchat-ghost:before{content:\"\uF2AC\"}.fa-snapchat-square:before{content:\"\uF2AD\"}.fa-pied-piper:before{content:\"\uF2AE\"}.fa-first-order:before{content:\"\uF2B0\"}.fa-yoast:before{content:\"\uF2B1\"}.fa-themeisle:before{content:\"\uF2B2\"}.fa-google-plus-circle:before,.fa-google-plus-official:before{content:\"\uF2B3\"}.fa-fa:before,.fa-font-awesome:before{content:\"\uF2B4\"}.fa-handshake-o:before{content:\"\uF2B5\"}.fa-envelope-open:before{content:\"\uF2B6\"}.fa-envelope-open-o:before{content:\"\uF2B7\"}.fa-linode:before{content:\"\uF2B8\"}.fa-address-book:before{content:\"\uF2B9\"}.fa-address-book-o:before{content:\"\uF2BA\"}.fa-address-card:before,.fa-vcard:before{content:\"\uF2BB\"}.fa-address-card-o:before,.fa-vcard-o:before{content:\"\uF2BC\"}.fa-user-circle:before{content:\"\uF2BD\"}.fa-user-circle-o:before{content:\"\uF2BE\"}.fa-user-o:before{content:\"\uF2C0\"}.fa-id-badge:before{content:\"\uF2C1\"}.fa-drivers-license:before,.fa-id-card:before{content:\"\uF2C2\"}.fa-drivers-license-o:before,.fa-id-card-o:before{content:\"\uF2C3\"}.fa-quora:before{content:\"\uF2C4\"}.fa-free-code-camp:before{content:\"\uF2C5\"}.fa-telegram:before{content:\"\uF2C6\"}.fa-thermometer-4:before,.fa-thermometer-full:before,.fa-thermometer:before{content:\"\uF2C7\"}.fa-thermometer-3:before,.fa-thermometer-three-quarters:before{content:\"\uF2C8\"}.fa-thermometer-2:before,.fa-thermometer-half:before{content:\"\uF2C9\"}.fa-thermometer-1:before,.fa-thermometer-quarter:before{content:\"\uF2CA\"}.fa-thermometer-0:before,.fa-thermometer-empty:before{content:\"\uF2CB\"}.fa-shower:before{content:\"\uF2CC\"}.fa-bath:before,.fa-bathtub:before,.fa-s15:before{content:\"\uF2CD\"}.fa-podcast:before{content:\"\uF2CE\"}.fa-window-maximize:before{content:\"\uF2D0\"}.fa-window-minimize:before{content:\"\uF2D1\"}.fa-window-restore:before{content:\"\uF2D2\"}.fa-times-rectangle:before,.fa-window-close:before{content:\"\uF2D3\"}.fa-times-rectangle-o:before,.fa-window-close-o:before{content:\"\uF2D4\"}.fa-bandcamp:before{content:\"\uF2D5\"}.fa-grav:before{content:\"\uF2D6\"}.fa-etsy:before{content:\"\uF2D7\"}.fa-imdb:before{content:\"\uF2D8\"}.fa-ravelry:before{content:\"\uF2D9\"}.fa-eercast:before{content:\"\uF2DA\"}.fa-microchip:before{content:\"\uF2DB\"}.fa-snowflake-o:before{content:\"\uF2DC\"}.fa-superpowers:before{content:\"\uF2DD\"}.fa-wpexplorer:before{content:\"\uF2DE\"}.fa-meetup:before{content:\"\uF2E0\"}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}a{cursor:pointer}.angular-editor-textarea{min-height:150px;overflow:auto;margin-top:5px;resize:vertical}.angular-editor-textarea:after{content:\"\";position:absolute;bottom:0;right:0;display:block;width:8px;height:8px;cursor:nwse-resize;background-color:rgba(255,255,255,.5)}.angular-editor-toolbar{font:100 .8rem/15px Roboto,Arial,sans-serif;background-color:#f5f5f5;padding:.2rem;border:1px solid #ddd}.angular-editor-toolbar .angular-editor-toolbar-set{display:inline-block;border-radius:5px;background-color:#fff;margin-right:5px;vertical-align:middle;border:1px solid #ddd;margin-bottom:3px;height:28px}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button{background-color:transparent;padding:.4rem;min-width:2rem;float:left;border:0 solid #ddd}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button:first-child{border-radius:5px 0 0 5px}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button:last-child{border-radius:0 5px 5px 0}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button:first-child:last-child{border-radius:5px}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button.focus,.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button:focus{outline:0}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button:disabled>.color-label{pointer-events:none;cursor:not-allowed}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button:disabled>.color-label.background,.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button:disabled>.color-label.foreground :after{background:#555}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button.active{background:#fff5b9}.angular-editor-toolbar .angular-editor-toolbar-set .angular-editor-button.active:hover{background-color:#fffa98}.angular-editor-toolbar .angular-editor-toolbar-set select{font-size:11px;width:90px;vertical-align:middle;background-color:transparent;border:.5px solid rgba(255,255,255,0);border-radius:5px;outline:0;padding:.4rem;cursor:pointer}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading{display:inline-block;width:90px;height:24px}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.angular-editor-toolbar .angular-editor-toolbar-set .select-font{display:inline-block;width:90px;height:24px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}.angular-editor-toolbar .angular-editor-toolbar-set .select-font:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size{display:inline-block;width:50px;height:24px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.angular-editor-toolbar .angular-editor-toolbar-set .select-custom-style{display:inline-block;width:90px;height:24px}@supports not (-moz-appearance:none){.angular-editor-toolbar .angular-editor-toolbar-set .select-heading optgroup{font-size:12px;background-color:#f4f4f4;padding:5px}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading option{border:1px solid;background-color:#fff}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading .default{font-size:16px}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading .h1{font-size:24px}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading .h2{font-size:20px}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading .h3{font-size:16px}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading .h4{font-size:15px}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading .h5{font-size:14px}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading .h6{font-size:13px}.angular-editor-toolbar .angular-editor-toolbar-set .select-heading .div,.angular-editor-toolbar .angular-editor-toolbar-set .select-heading .pre{font-size:12px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font optgroup{font-size:12px;background-color:#f4f4f4;padding:5px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font option{border:1px solid;background-color:#fff}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size optgroup{font-size:12px;background-color:#f4f4f4;padding:5px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size option{border:1px solid;background-color:#fff}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size .size1{font-size:10px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size .size2{font-size:12px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size .size3{font-size:14px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size .size4{font-size:16px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size .size5{font-size:18px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size .size6{font-size:20px}.angular-editor-toolbar .angular-editor-toolbar-set .select-font-size .size7{font-size:22px}.angular-editor-toolbar .angular-editor-toolbar-set .select-custom-style optgroup{font-size:12px;background-color:#f4f4f4;padding:5px}.angular-editor-toolbar .angular-editor-toolbar-set .select-custom-style option{border:1px solid;background-color:#fff}}.angular-editor-toolbar .angular-editor-toolbar-set .select-custom-style:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}.angular-editor-toolbar .angular-editor-toolbar-set .select-custom-style:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.angular-editor-toolbar .angular-editor-toolbar-set .color-label{position:relative;cursor:pointer}.angular-editor-toolbar .angular-editor-toolbar-set .background{font-size:smaller;background:#1b1b1b;color:#fff;padding:3px}.angular-editor-toolbar .angular-editor-toolbar-set .foreground :after{position:absolute;content:\"\";left:-1px;top:auto;bottom:-3px;right:auto;width:15px;height:2px;z-index:0;background:#1b1b1b}.angular-editor{position:relative}.angular-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);color:#868e96;opacity:1}.angular-editor .angular-editor-wrapper{position:relative}.angular-editor .angular-editor-wrapper .angular-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;position:relative}.angular-editor .angular-editor-wrapper .angular-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.angular-editor .angular-editor-wrapper ::ng-deep p{margin-bottom:0}.angular-editor .angular-editor-wrapper .angular-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;color:#6c757d;opacity:.75}.angular-editor .angular-editor-wrapper.show-placeholder .angular-editor-placeholder{display:block}.angular-editor .angular-editor-wrapper.disabled{cursor:not-allowed;opacity:.5;pointer-events:none}"]
            }] }
];
/** @nocollapse */
AngularEditorComponent.ctorParameters = () => [
    { type: Renderer2 },
    { type: AngularEditorService },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: DomSanitizer },
    { type: ChangeDetectorRef },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: undefined, decorators: [{ type: Attribute, args: ['autofocus',] }] }
];
AngularEditorComponent.propDecorators = {
    id: [{ type: Input }],
    config: [{ type: Input }],
    placeholder: [{ type: Input }],
    tabIndex: [{ type: Input }],
    html: [{ type: Output }],
    textArea: [{ type: ViewChild, args: ['editor', { static: true },] }],
    editorWrapper: [{ type: ViewChild, args: ['editorWrapper', { static: true },] }],
    editorToolbar: [{ type: ViewChild, args: ['editorToolbar', { static: false },] }],
    viewMode: [{ type: Output }],
    blurEvent: [{ type: Output, args: ['blur',] }],
    focusEvent: [{ type: Output, args: ['focus',] }],
    tabindex: [{ type: HostBinding, args: ['attr.tabindex',] }],
    onFocus: [{ type: HostListener, args: ['focus',] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    AngularEditorComponent.prototype.onChange;
    /**
     * @type {?}
     * @private
     */
    AngularEditorComponent.prototype.onTouched;
    /** @type {?} */
    AngularEditorComponent.prototype.modeVisual;
    /** @type {?} */
    AngularEditorComponent.prototype.showPlaceholder;
    /** @type {?} */
    AngularEditorComponent.prototype.disabled;
    /** @type {?} */
    AngularEditorComponent.prototype.focused;
    /** @type {?} */
    AngularEditorComponent.prototype.touched;
    /** @type {?} */
    AngularEditorComponent.prototype.changed;
    /** @type {?} */
    AngularEditorComponent.prototype.focusInstance;
    /** @type {?} */
    AngularEditorComponent.prototype.blurInstance;
    /** @type {?} */
    AngularEditorComponent.prototype.id;
    /** @type {?} */
    AngularEditorComponent.prototype.config;
    /** @type {?} */
    AngularEditorComponent.prototype.placeholder;
    /** @type {?} */
    AngularEditorComponent.prototype.tabIndex;
    /** @type {?} */
    AngularEditorComponent.prototype.html;
    /** @type {?} */
    AngularEditorComponent.prototype.textArea;
    /** @type {?} */
    AngularEditorComponent.prototype.editorWrapper;
    /** @type {?} */
    AngularEditorComponent.prototype.editorToolbar;
    /** @type {?} */
    AngularEditorComponent.prototype.viewMode;
    /**
     * emits `blur` event when focused out from the textarea
     * @type {?}
     */
    AngularEditorComponent.prototype.blurEvent;
    /**
     * emits `focus` event when focused in to the textarea
     * @type {?}
     */
    AngularEditorComponent.prototype.focusEvent;
    /** @type {?} */
    AngularEditorComponent.prototype.tabindex;
    /**
     * @type {?}
     * @private
     */
    AngularEditorComponent.prototype.r;
    /**
     * @type {?}
     * @private
     */
    AngularEditorComponent.prototype.editorService;
    /**
     * @type {?}
     * @private
     */
    AngularEditorComponent.prototype.doc;
    /**
     * @type {?}
     * @private
     */
    AngularEditorComponent.prototype.sanitizer;
    /**
     * @type {?}
     * @private
     */
    AngularEditorComponent.prototype.cdRef;
    /**
     * @type {?}
     * @private
     */
    AngularEditorComponent.prototype.autoFocus;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGdsb2JhbHZveC9hbmd1bGFyLWVkaXRvci8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBQXNCLG1CQUFtQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ2xFLE9BQU8sRUFBQyw2QkFBNkIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ2pGLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzlELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQWNsQyxNQUFNLE9BQU8sc0JBQXNCOzs7Ozs7Ozs7O0lBMkNqQyxZQUNVLENBQVksRUFDWixhQUFtQyxFQUNqQixHQUFRLEVBQzFCLFNBQXVCLEVBQ3ZCLEtBQXdCLEVBQ1QsZUFBdUIsRUFDZCxTQUFjO1FBTnRDLE1BQUMsR0FBRCxDQUFDLENBQVc7UUFDWixrQkFBYSxHQUFiLGFBQWEsQ0FBc0I7UUFDakIsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUMxQixjQUFTLEdBQVQsU0FBUyxDQUFjO1FBQ3ZCLFVBQUssR0FBTCxLQUFLLENBQW1CO1FB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QyxRQUFRO1lBN0RaLFlBQVk7WUFyQmxCLGlCQUFpQjt5Q0FxRmQsU0FBUyxTQUFDLFVBQVU7NENBQ3BCLFNBQVMsU0FBQyxXQUFXOzs7aUJBbkN2QixLQUFLO3FCQUNMLEtBQUs7MEJBQ0wsS0FBSzt1QkFDTCxLQUFLO21CQUVMLE1BQU07dUJBRU4sU0FBUyxTQUFDLFFBQVEsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7NEJBQ2xDLFNBQVMsU0FBQyxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDOzRCQUN6QyxTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzt1QkFFMUMsTUFBTTt3QkFJTixNQUFNLFNBQUMsTUFBTTt5QkFJYixNQUFNLFNBQUMsT0FBTzt1QkFFZCxXQUFXLFNBQUMsZUFBZTtzQkFFM0IsWUFBWSxTQUFDLE9BQU87Ozs7Ozs7SUFwQ3JCLDBDQUEwQzs7Ozs7SUFDMUMsMkNBQThCOztJQUU5Qiw0Q0FBa0I7O0lBQ2xCLGlEQUF3Qjs7SUFDeEIsMENBQWlCOztJQUNqQix5Q0FBZ0I7O0lBQ2hCLHlDQUFnQjs7SUFDaEIseUNBQWdCOztJQUVoQiwrQ0FBbUI7O0lBQ25CLDhDQUFrQjs7SUFFbEIsb0NBQWlCOztJQUNqQix3Q0FBMkQ7O0lBQzNELDZDQUEwQjs7SUFDMUIsMENBQWlDOztJQUVqQyxzQ0FBZTs7SUFFZiwwQ0FBMEQ7O0lBQzFELCtDQUFzRTs7SUFDdEUsK0NBQTBGOztJQUUxRiwwQ0FBaUQ7Ozs7O0lBSWpELDJDQUFxRjs7Ozs7SUFJckYsNENBQXVGOztJQUV2RiwwQ0FBNEM7Ozs7O0lBUTFDLG1DQUFvQjs7Ozs7SUFDcEIsK0NBQTJDOzs7OztJQUMzQyxxQ0FBa0M7Ozs7O0lBQ2xDLDJDQUErQjs7Ozs7SUFDL0IsdUNBQWdDOzs7OztJQUVoQywyQ0FBOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgQXR0cmlidXRlLFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIENvbXBvbmVudCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBmb3J3YXJkUmVmLFxyXG4gIEhvc3RCaW5kaW5nLFxyXG4gIEhvc3RMaXN0ZW5lcixcclxuICBJbmplY3QsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIE9uSW5pdCxcclxuICBPdXRwdXQsXHJcbiAgUmVuZGVyZXIyLFxyXG4gIFNlY3VyaXR5Q29udGV4dCxcclxuICBWaWV3Q2hpbGRcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHtBbmd1bGFyRWRpdG9yQ29uZmlnLCBhbmd1bGFyRWRpdG9yQ29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XHJcbmltcG9ydCB7QW5ndWxhckVkaXRvclRvb2xiYXJDb21wb25lbnR9IGZyb20gJy4vYW5ndWxhci1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQnO1xyXG5pbXBvcnQge0FuZ3VsYXJFZGl0b3JTZXJ2aWNlfSBmcm9tICcuL2FuZ3VsYXItZWRpdG9yLnNlcnZpY2UnO1xyXG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0RvbVNhbml0aXplcn0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7aXNEZWZpbmVkfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYW5ndWxhci1lZGl0b3InLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9hbmd1bGFyLWVkaXRvci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vYW5ndWxhci1lZGl0b3IuY29tcG9uZW50LnNjc3MnXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFuZ3VsYXJFZGl0b3JDb21wb25lbnQpLFxyXG4gICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgfVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xyXG5cclxuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcclxuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZDtcclxuXHJcbiAgbW9kZVZpc3VhbCA9IHRydWU7XHJcbiAgc2hvd1BsYWNlaG9sZGVyID0gZmFsc2U7XHJcbiAgZGlzYWJsZWQgPSBmYWxzZTtcclxuICBmb2N1c2VkID0gZmFsc2U7XHJcbiAgdG91Y2hlZCA9IGZhbHNlO1xyXG4gIGNoYW5nZWQgPSBmYWxzZTtcclxuXHJcbiAgZm9jdXNJbnN0YW5jZTogYW55O1xyXG4gIGJsdXJJbnN0YW5jZTogYW55O1xyXG5cclxuICBASW5wdXQoKSBpZCA9ICcnO1xyXG4gIEBJbnB1dCgpIGNvbmZpZzogQW5ndWxhckVkaXRvckNvbmZpZyA9IGFuZ3VsYXJFZGl0b3JDb25maWc7XHJcbiAgQElucHV0KCkgcGxhY2Vob2xkZXIgPSAnJztcclxuICBASW5wdXQoKSB0YWJJbmRleDogbnVtYmVyIHwgbnVsbDtcclxuXHJcbiAgQE91dHB1dCgpIGh0bWw7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ2VkaXRvcicsIHtzdGF0aWM6IHRydWV9KSB0ZXh0QXJlYTogRWxlbWVudFJlZjtcclxuICBAVmlld0NoaWxkKCdlZGl0b3JXcmFwcGVyJywge3N0YXRpYzogdHJ1ZX0pIGVkaXRvcldyYXBwZXI6IEVsZW1lbnRSZWY7XHJcbiAgQFZpZXdDaGlsZCgnZWRpdG9yVG9vbGJhcicsIHtzdGF0aWM6IGZhbHNlfSkgZWRpdG9yVG9vbGJhcjogQW5ndWxhckVkaXRvclRvb2xiYXJDb21wb25lbnQ7XHJcblxyXG4gIEBPdXRwdXQoKSB2aWV3TW9kZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcclxuXHJcbiAgLyoqIGVtaXRzIGBibHVyYCBldmVudCB3aGVuIGZvY3VzZWQgb3V0IGZyb20gdGhlIHRleHRhcmVhICovXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW5hdGl2ZSBuby1vdXRwdXQtcmVuYW1lXHJcbiAgQE91dHB1dCgnYmx1cicpIGJsdXJFdmVudDogRXZlbnRFbWl0dGVyPEZvY3VzRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxGb2N1c0V2ZW50PigpO1xyXG5cclxuICAvKiogZW1pdHMgYGZvY3VzYCBldmVudCB3aGVuIGZvY3VzZWQgaW4gdG8gdGhlIHRleHRhcmVhICovXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LXJlbmFtZSBuby1vdXRwdXQtbmF0aXZlXHJcbiAgQE91dHB1dCgnZm9jdXMnKSBmb2N1c0V2ZW50OiBFdmVudEVtaXR0ZXI8Rm9jdXNFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPEZvY3VzRXZlbnQ+KCk7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci50YWJpbmRleCcpIHRhYmluZGV4ID0gLTE7XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJylcclxuICBvbkZvY3VzKCkge1xyXG4gICAgdGhpcy5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHI6IFJlbmRlcmVyMixcclxuICAgIHByaXZhdGUgZWRpdG9yU2VydmljZTogQW5ndWxhckVkaXRvclNlcnZpY2UsXHJcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvYzogYW55LFxyXG4gICAgcHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplcixcclxuICAgIHByaXZhdGUgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSBkZWZhdWx0VGFiSW5kZXg6IHN0cmluZyxcclxuICAgIEBBdHRyaWJ1dGUoJ2F1dG9mb2N1cycpIHByaXZhdGUgYXV0b0ZvY3VzOiBhbnlcclxuICApIHtcclxuICAgIGNvbnN0IHBhcnNlZFRhYkluZGV4ID0gTnVtYmVyKGRlZmF1bHRUYWJJbmRleCk7XHJcbiAgICB0aGlzLnRhYkluZGV4ID0gKHBhcnNlZFRhYkluZGV4IHx8IHBhcnNlZFRhYkluZGV4ID09PSAwKSA/IHBhcnNlZFRhYkluZGV4IDogbnVsbDtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5jb25maWcudG9vbGJhclBvc2l0aW9uID0gdGhpcy5jb25maWcudG9vbGJhclBvc2l0aW9uID8gdGhpcy5jb25maWcudG9vbGJhclBvc2l0aW9uIDogYW5ndWxhckVkaXRvckNvbmZpZy50b29sYmFyUG9zaXRpb247XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICBpZiAoaXNEZWZpbmVkKHRoaXMuYXV0b0ZvY3VzKSkge1xyXG4gICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeGVjdXRlZCBjb21tYW5kIGZyb20gZWRpdG9yIGhlYWRlciBidXR0b25zXHJcbiAgICogQHBhcmFtIGNvbW1hbmQgc3RyaW5nIGZyb20gdHJpZ2dlckNvbW1hbmRcclxuICAgKi9cclxuICBleGVjdXRlQ29tbWFuZChjb21tYW5kOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuZm9jdXMoKTtcclxuICAgIGlmIChjb21tYW5kID09PSAndG9nZ2xlRWRpdG9yTW9kZScpIHtcclxuICAgICAgdGhpcy50b2dnbGVFZGl0b3JNb2RlKHRoaXMubW9kZVZpc3VhbCk7XHJcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgIT09ICcnKSB7XHJcbiAgICAgIGlmIChjb21tYW5kID09PSAnY2xlYXInKSB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3JTZXJ2aWNlLnJlbW92ZVNlbGVjdGVkRWxlbWVudHModGhpcy5nZXRDdXN0b21UYWdzKCkpO1xyXG4gICAgICAgIHRoaXMub25Db250ZW50Q2hhbmdlKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5pbm5lckhUTUwpO1xyXG4gICAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09ICdkZWZhdWx0Jykge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yU2VydmljZS5yZW1vdmVTZWxlY3RlZEVsZW1lbnRzKCdoMSxoMixoMyxoNCxoNSxoNixwLHByZScpO1xyXG4gICAgICAgIHRoaXMub25Db250ZW50Q2hhbmdlKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5pbm5lckhUTUwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yU2VydmljZS5leGVjdXRlQ29tbWFuZChjb21tYW5kKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmV4ZWMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGZvY3VzIGV2ZW50XHJcbiAgICovXHJcbiAgb25UZXh0QXJlYUZvY3VzKGV2ZW50OiBGb2N1c0V2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5mb2N1c2VkKSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5mb2N1c0V2ZW50LmVtaXQoZXZlbnQpO1xyXG4gICAgaWYgKCF0aGlzLnRvdWNoZWQgfHwgIXRoaXMuY2hhbmdlZCkge1xyXG4gICAgICB0aGlzLmVkaXRvclNlcnZpY2UuZXhlY3V0ZUluTmV4dFF1ZXVlSXRlcmF0aW9uKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZSgpO1xyXG4gICAgICAgIHRoaXMudG91Y2hlZCA9IHRydWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGRlc2NyaXB0aW9uIGZpcmVzIHdoZW4gY3Vyc29yIGxlYXZlcyB0ZXh0YXJlYVxyXG4gICAqL1xyXG4gIHB1YmxpYyBvblRleHRBcmVhTW91c2VPdXQoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuZWRpdG9yU2VydmljZS5zYXZlU2VsZWN0aW9uKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBibHVyIGV2ZW50XHJcbiAgICovXHJcbiAgb25UZXh0QXJlYUJsdXIoZXZlbnQ6IEZvY3VzRXZlbnQpIHtcclxuICAgIC8qKlxyXG4gICAgICogc2F2ZSBzZWxlY3Rpb24gaWYgZm9jdXNzZWQgb3V0XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZWRpdG9yU2VydmljZS5leGVjdXRlSW5OZXh0UXVldWVJdGVyYXRpb24odGhpcy5lZGl0b3JTZXJ2aWNlLnNhdmVTZWxlY3Rpb24pO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5vblRvdWNoZWQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXZlbnQucmVsYXRlZFRhcmdldCAhPT0gbnVsbCkge1xyXG4gICAgICBjb25zdCBwYXJlbnQgPSAoZXZlbnQucmVsYXRlZFRhcmdldCBhcyBIVE1MRWxlbWVudCkucGFyZW50RWxlbWVudDtcclxuICAgICAgLy8gaWYgKCFwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhbmd1bGFyLWVkaXRvci10b29sYmFyLXNldCcpICYmICFwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhZS1waWNrZXInKSkge1xyXG4gICAgICAvLyAgIHRoaXMuYmx1ckV2ZW50LmVtaXQoZXZlbnQpO1xyXG4gICAgICAvLyAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xyXG4gICAgICAvLyB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgZm9jdXMgdGhlIHRleHQgYXJlYSB3aGVuIHRoZSBlZGl0b3IgaXMgZm9jdXNlZFxyXG4gICAqL1xyXG4gIGZvY3VzKCkge1xyXG4gICAgaWYgKHRoaXMubW9kZVZpc3VhbCkge1xyXG4gICAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHNvdXJjZVRleHQgPSB0aGlzLmRvYy5nZXRFbGVtZW50QnlJZCgnc291cmNlVGV4dCcgKyB0aGlzLmlkKTtcclxuICAgICAgc291cmNlVGV4dC5mb2N1cygpO1xyXG4gICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXhlY3V0ZWQgZnJvbSB0aGUgY29udGVudGVkaXRhYmxlIHNlY3Rpb24gd2hpbGUgdGhlIGlucHV0IHByb3BlcnR5IGNoYW5nZXNcclxuICAgKiBAcGFyYW0gaHRtbCBodG1sIHN0cmluZyBmcm9tIGNvbnRlbnRlZGl0YWJsZVxyXG4gICAqL1xyXG4gIG9uQ29udGVudENoYW5nZShodG1sOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGlmICgoIWh0bWwgfHwgaHRtbCA9PT0gJzxicj4nKSkge1xyXG4gICAgICBodG1sID0gJyc7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLmNvbmZpZy5zYW5pdGl6ZSB8fCB0aGlzLmNvbmZpZy5zYW5pdGl6ZSA9PT0gdW5kZWZpbmVkID9cclxuICAgICAgICB0aGlzLnNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgaHRtbCkgOiBodG1sKTtcclxuICAgICAgaWYgKCghaHRtbCkgIT09IHRoaXMuc2hvd1BsYWNlaG9sZGVyKSB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVQbGFjZWhvbGRlcih0aGlzLnNob3dQbGFjZWhvbGRlcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuY2hhbmdlZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZFxyXG4gICAqIHdoZW4gdGhlIGNvbnRyb2wgcmVjZWl2ZXMgYSBjaGFuZ2UgZXZlbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZm4gYSBmdW5jdGlvblxyXG4gICAqL1xyXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5vbkNoYW5nZSA9IGUgPT4gKGUgPT09ICc8YnI+JyA/IGZuKCcnKSA6IGZuKGUpKSA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZFxyXG4gICAqIHdoZW4gdGhlIGNvbnRyb2wgcmVjZWl2ZXMgYSB0b3VjaCBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmbiBhIGZ1bmN0aW9uXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFdyaXRlIGEgbmV3IHZhbHVlIHRvIHRoZSBlbGVtZW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHZhbHVlIHZhbHVlIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlcmUgaXMgYSBjaGFuZ2UgaW4gY29udGVudGVkaXRhYmxlXHJcbiAgICovXHJcbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XHJcblxyXG4gICAgaWYgKCghdmFsdWUgfHwgdmFsdWUgPT09ICc8YnI+JyB8fCB2YWx1ZSA9PT0gJycpICE9PSB0aGlzLnNob3dQbGFjZWhvbGRlcikge1xyXG4gICAgICB0aGlzLnRvZ2dsZVBsYWNlaG9sZGVyKHRoaXMuc2hvd1BsYWNlaG9sZGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICc8YnI+Jykge1xyXG4gICAgICB2YWx1ZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZWZyZXNoVmlldyh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZWZyZXNoIHZpZXcvSFRNTCBvZiB0aGUgZWRpdG9yXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdmFsdWUgaHRtbCBzdHJpbmcgZnJvbSB0aGUgZWRpdG9yXHJcbiAgICovXHJcbiAgcmVmcmVzaFZpZXcodmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT09IG51bGwgPyAnJyA6IHZhbHVlO1xyXG4gICAgdGhpcy5yLnNldFByb3BlcnR5KHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudCwgJ2lubmVySFRNTCcsIG5vcm1hbGl6ZWRWYWx1ZSk7XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdG9nZ2xlcyBwbGFjZWhvbGRlciBiYXNlZCBvbiBpbnB1dCBzdHJpbmdcclxuICAgKlxyXG4gICAqIEBwYXJhbSB2YWx1ZSBBIEhUTUwgc3RyaW5nIGZyb20gdGhlIGVkaXRvclxyXG4gICAqL1xyXG4gIHRvZ2dsZVBsYWNlaG9sZGVyKHZhbHVlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgIHRoaXMuci5hZGRDbGFzcyh0aGlzLmVkaXRvcldyYXBwZXIubmF0aXZlRWxlbWVudCwgJ3Nob3ctcGxhY2Vob2xkZXInKTtcclxuICAgICAgdGhpcy5zaG93UGxhY2Vob2xkZXIgPSB0cnVlO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuci5yZW1vdmVDbGFzcyh0aGlzLmVkaXRvcldyYXBwZXIubmF0aXZlRWxlbWVudCwgJ3Nob3ctcGxhY2Vob2xkZXInKTtcclxuICAgICAgdGhpcy5zaG93UGxhY2Vob2xkZXIgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEltcGxlbWVudHMgZGlzYWJsZWQgc3RhdGUgZm9yIHRoaXMgZWxlbWVudFxyXG4gICAqXHJcbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgRGlzYWJsZWQgZmxhZ1xyXG4gICAqL1xyXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgY29uc3QgZGl2ID0gdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50O1xyXG4gICAgY29uc3QgYWN0aW9uID0gaXNEaXNhYmxlZCA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnO1xyXG4gICAgdGhpcy5yW2FjdGlvbl0oZGl2LCAnZGlzYWJsZWQnKTtcclxuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdG9nZ2xlcyBlZGl0b3IgbW9kZSBiYXNlZCBvbiBiVG9Tb3VyY2UgYm9vbFxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJUb1NvdXJjZSBBIGJvb2xlYW4gdmFsdWUgZnJvbSB0aGUgZWRpdG9yXHJcbiAgICovXHJcbiAgdG9nZ2xlRWRpdG9yTW9kZShiVG9Tb3VyY2U6IGJvb2xlYW4pIHtcclxuICAgIGxldCBvQ29udGVudDogYW55O1xyXG4gICAgY29uc3QgZWRpdGFibGVFbGVtZW50ID0gdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50O1xyXG5cclxuICAgIGlmIChiVG9Tb3VyY2UpIHtcclxuICAgICAgb0NvbnRlbnQgPSB0aGlzLnIuY3JlYXRlVGV4dChlZGl0YWJsZUVsZW1lbnQuaW5uZXJIVE1MKTtcclxuICAgICAgdGhpcy5yLnNldFByb3BlcnR5KGVkaXRhYmxlRWxlbWVudCwgJ2lubmVySFRNTCcsICcnKTtcclxuICAgICAgdGhpcy5yLnNldFByb3BlcnR5KGVkaXRhYmxlRWxlbWVudCwgJ2NvbnRlbnRFZGl0YWJsZScsIGZhbHNlKTtcclxuXHJcbiAgICAgIGNvbnN0IG9QcmUgPSB0aGlzLnIuY3JlYXRlRWxlbWVudCgncHJlJyk7XHJcbiAgICAgIHRoaXMuci5zZXRTdHlsZShvUHJlLCAnbWFyZ2luJywgJzAnKTtcclxuICAgICAgdGhpcy5yLnNldFN0eWxlKG9QcmUsICdvdXRsaW5lJywgJ25vbmUnKTtcclxuXHJcbiAgICAgIGNvbnN0IG9Db2RlID0gdGhpcy5yLmNyZWF0ZUVsZW1lbnQoJ2NvZGUnKTtcclxuICAgICAgdGhpcy5yLnNldFByb3BlcnR5KG9Db2RlLCAnaWQnLCAnc291cmNlVGV4dCcgKyB0aGlzLmlkKTtcclxuICAgICAgdGhpcy5yLnNldFN0eWxlKG9Db2RlLCAnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICB0aGlzLnIuc2V0U3R5bGUob0NvZGUsICd3aGl0ZS1zcGFjZScsICdwcmUtd3JhcCcpO1xyXG4gICAgICB0aGlzLnIuc2V0U3R5bGUob0NvZGUsICd3b3JkLWJyZWFrJywgJ2tlZXAtYWxsJyk7XHJcbiAgICAgIHRoaXMuci5zZXRTdHlsZShvQ29kZSwgJ291dGxpbmUnLCAnbm9uZScpO1xyXG4gICAgICB0aGlzLnIuc2V0U3R5bGUob0NvZGUsICdtYXJnaW4nLCAnMCcpO1xyXG4gICAgICB0aGlzLnIuc2V0U3R5bGUob0NvZGUsICdiYWNrZ3JvdW5kLWNvbG9yJywgJyNmZmY1YjknKTtcclxuICAgICAgdGhpcy5yLnNldFByb3BlcnR5KG9Db2RlLCAnY29udGVudEVkaXRhYmxlJywgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuci5hcHBlbmRDaGlsZChvQ29kZSwgb0NvbnRlbnQpO1xyXG4gICAgICB0aGlzLmZvY3VzSW5zdGFuY2UgPSB0aGlzLnIubGlzdGVuKG9Db2RlLCAnZm9jdXMnLCAoZXZlbnQpID0+IHRoaXMub25UZXh0QXJlYUZvY3VzKGV2ZW50KSk7XHJcbiAgICAgIHRoaXMuYmx1ckluc3RhbmNlID0gdGhpcy5yLmxpc3RlbihvQ29kZSwgJ2JsdXInLCAoZXZlbnQpID0+IHRoaXMub25UZXh0QXJlYUJsdXIoZXZlbnQpKTtcclxuICAgICAgdGhpcy5yLmFwcGVuZENoaWxkKG9QcmUsIG9Db2RlKTtcclxuICAgICAgdGhpcy5yLmFwcGVuZENoaWxkKGVkaXRhYmxlRWxlbWVudCwgb1ByZSk7XHJcblxyXG4gICAgICAvLyBUb0RvIG1vdmUgdG8gc2VydmljZVxyXG4gICAgICB0aGlzLmRvYy5leGVjQ29tbWFuZCgnZGVmYXVsdFBhcmFncmFwaFNlcGFyYXRvcicsIGZhbHNlLCAnZGl2Jyk7XHJcblxyXG4gICAgICB0aGlzLm1vZGVWaXN1YWwgPSBmYWxzZTtcclxuICAgICAgdGhpcy52aWV3TW9kZS5lbWl0KGZhbHNlKTtcclxuICAgICAgb0NvZGUuZm9jdXMoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh0aGlzLmRvYy5xdWVyeVNlbGVjdG9yQWxsKSB7XHJcbiAgICAgICAgdGhpcy5yLnNldFByb3BlcnR5KGVkaXRhYmxlRWxlbWVudCwgJ2lubmVySFRNTCcsIGVkaXRhYmxlRWxlbWVudC5pbm5lclRleHQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9Db250ZW50ID0gdGhpcy5kb2MuY3JlYXRlUmFuZ2UoKTtcclxuICAgICAgICBvQ29udGVudC5zZWxlY3ROb2RlQ29udGVudHMoZWRpdGFibGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIHRoaXMuci5zZXRQcm9wZXJ0eShlZGl0YWJsZUVsZW1lbnQsICdpbm5lckhUTUwnLCBvQ29udGVudC50b1N0cmluZygpKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnIuc2V0UHJvcGVydHkoZWRpdGFibGVFbGVtZW50LCAnY29udGVudEVkaXRhYmxlJywgdHJ1ZSk7XHJcbiAgICAgIHRoaXMubW9kZVZpc3VhbCA9IHRydWU7XHJcbiAgICAgIHRoaXMudmlld01vZGUuZW1pdCh0cnVlKTtcclxuICAgICAgdGhpcy5vbkNvbnRlbnRDaGFuZ2UoZWRpdGFibGVFbGVtZW50LmlubmVySFRNTCk7XHJcbiAgICAgIGVkaXRhYmxlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5lZGl0b3JUb29sYmFyLnNldEVkaXRvck1vZGUoIXRoaXMubW9kZVZpc3VhbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB0b2dnbGVzIGVkaXRvciBidXR0b25zIHdoZW4gY3Vyc29yIG1vdmVkIG9yIHBvc2l0aW9uaW5nXHJcbiAgICpcclxuICAgKiBTZW5kIGEgbm9kZSBhcnJheSBmcm9tIHRoZSBjb250ZW50RWRpdGFibGUgb2YgdGhlIGVkaXRvclxyXG4gICAqL1xyXG4gIGV4ZWMoKSB7XHJcbiAgICB0aGlzLmVkaXRvclRvb2xiYXIudHJpZ2dlckJ1dHRvbnMoKTtcclxuXHJcbiAgICBsZXQgdXNlclNlbGVjdGlvbjtcclxuICAgIGlmICh0aGlzLmRvYy5nZXRTZWxlY3Rpb24pIHtcclxuICAgICAgdXNlclNlbGVjdGlvbiA9IHRoaXMuZG9jLmdldFNlbGVjdGlvbigpO1xyXG4gICAgICB0aGlzLmVkaXRvclNlcnZpY2UuZXhlY3V0ZUluTmV4dFF1ZXVlSXRlcmF0aW9uKHRoaXMuZWRpdG9yU2VydmljZS5zYXZlU2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYSA9IHVzZXJTZWxlY3Rpb24uZm9jdXNOb2RlO1xyXG4gICAgY29uc3QgZWxzID0gW107XHJcbiAgICB3aGlsZSAoYSAmJiBhLmlkICE9PSAnZWRpdG9yJykge1xyXG4gICAgICBlbHMudW5zaGlmdChhKTtcclxuICAgICAgYSA9IGEucGFyZW50Tm9kZTtcclxuICAgIH1cclxuICAgIHRoaXMuZWRpdG9yVG9vbGJhci50cmlnZ2VyQmxvY2tzKGVscyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbmZpZ3VyZSgpIHtcclxuICAgIHRoaXMuZWRpdG9yU2VydmljZS51cGxvYWRVcmwgPSB0aGlzLmNvbmZpZy51cGxvYWRVcmw7XHJcbiAgICBpZiAodGhpcy5jb25maWcuZGVmYXVsdFBhcmFncmFwaFNlcGFyYXRvcikge1xyXG4gICAgICB0aGlzLmVkaXRvclNlcnZpY2Uuc2V0RGVmYXVsdFBhcmFncmFwaFNlcGFyYXRvcih0aGlzLmNvbmZpZy5kZWZhdWx0UGFyYWdyYXBoU2VwYXJhdG9yKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmNvbmZpZy5kZWZhdWx0Rm9udE5hbWUpIHtcclxuICAgICAgdGhpcy5lZGl0b3JTZXJ2aWNlLnNldEZvbnROYW1lKHRoaXMuY29uZmlnLmRlZmF1bHRGb250TmFtZSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5jb25maWcuZGVmYXVsdEZvbnRTaXplKSB7XHJcbiAgICAgIHRoaXMuZWRpdG9yU2VydmljZS5zZXRGb250U2l6ZSh0aGlzLmNvbmZpZy5kZWZhdWx0Rm9udFNpemUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Rm9udHMoKSB7XHJcbiAgICBjb25zdCBmb250cyA9IHRoaXMuY29uZmlnLmZvbnRzID8gdGhpcy5jb25maWcuZm9udHMgOiBhbmd1bGFyRWRpdG9yQ29uZmlnLmZvbnRzO1xyXG4gICAgcmV0dXJuIGZvbnRzLm1hcCh4ID0+IHtcclxuICAgICAgcmV0dXJuIHtsYWJlbDogeC5uYW1lLCB2YWx1ZTogeC5uYW1lfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VzdG9tVGFncygpIHtcclxuICAgIGNvbnN0IHRhZ3MgPSBbJ3NwYW4nXTtcclxuICAgIHRoaXMuY29uZmlnLmN1c3RvbUNsYXNzZXMuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgaWYgKHgudGFnICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoIXRhZ3MuaW5jbHVkZXMoeC50YWcpKSB7XHJcbiAgICAgICAgICB0YWdzLnB1c2goeC50YWcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGFncy5qb2luKCcsJyk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIGlmICh0aGlzLmJsdXJJbnN0YW5jZSkge1xyXG4gICAgICB0aGlzLmJsdXJJbnN0YW5jZSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZm9jdXNJbnN0YW5jZSkge1xyXG4gICAgICB0aGlzLmZvY3VzSW5zdGFuY2UoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19
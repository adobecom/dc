import * as Axe from 'axe-core';
import { SerialFrameSelector, RunOptions, Spec, AxeResults } from 'axe-core';
import { Page, Frame, Browser } from 'puppeteer';

type AnalyzeCB = (err: Error | null, result?: Axe.AxeResults) => void;
interface IPageOptions {
    opts?: any;
    source?: string;
}

declare class AxePuppeteer {
    private frame;
    private axeSource?;
    private includes;
    private excludes;
    private axeOptions;
    private config;
    private disabledFrameSelectors;
    private page;
    private legacyMode;
    private errorUrl;
    constructor(pageFrame: Page | Frame, source?: string);
    include(selector: SerialFrameSelector): this;
    exclude(selector: SerialFrameSelector): this;
    options(options: RunOptions): this;
    withRules(rules: string | string[]): this;
    withTags(tags: string | string[]): this;
    disableRules(rules: string | string[]): this;
    configure(config: Spec): this;
    disableFrame(selector: string): this;
    setLegacyMode(legacyMode?: boolean): this;
    analyze(): Promise<AxeResults>;
    analyze<T extends AnalyzeCB>(callback?: T): Promise<AxeResults | null>;
    private analyzePromise;
    private runPartialRecursive;
    private finishRun;
    private runLegacy;
}

declare function loadPage(browser: Browser, url: string, pageOpts?: IPageOptions): Promise<OwningAxePuppeteer>;
declare class OwningAxePuppeteer extends AxePuppeteer {
    private newPage;
    constructor(page: Page, source?: string);
    analyze(): Promise<Axe.AxeResults>;
    analyze<T extends AnalyzeCB>(callback?: T): Promise<Axe.AxeResults | null>;
}

export { type AnalyzeCB, AxePuppeteer, type IPageOptions, AxePuppeteer as default, loadPage };

import * as ko from "knockout";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";

import * as strings from "SpfxPnpJsExampleWebPartStrings";
import SpfxPnpJsExampleViewModel, {
  IPnPjsExampleBindingContext
} from "./SpfxPnpJsExampleViewModel";

let _instance: number = 0;

export interface ISpfxPnpJsExampleWebPartProps {
  description: string;
}

export default class SpfxPnpJsExampleWebPart extends BaseClientSideWebPart<
  ISpfxPnpJsExampleWebPartProps
> {
  private _id: number;
  private _componentElement: HTMLElement;
  private _koDescription: KnockoutObservable<string> = ko.observable("");

  /**
   * Shouter is used to communicate between web part and view model.
   */
  private _shouter: KnockoutSubscribable<{}> = new ko.subscribable();

  /**
   * Initialize the web part.
   */
  /**
   * Initialize the web part.
   */
  protected onInit(): Promise<void> {
    this._id = _instance++;

    const tagName: string = `ComponentElement-${this._id}`;
    this._componentElement = this._createComponentElement(tagName);
    this._registerComponent(tagName);

    // When web part description is changed, notify view model to update.
    this._koDescription.subscribe((newValue: string) => {
      this._shouter.notifySubscribers(newValue, "description");
    });

    const bindings: IPnPjsExampleBindingContext = {
      description: this.properties.description,
      shouter: this._shouter
    };

    ko.applyBindings(bindings, this._componentElement);

    sp.setup({
      spfxContext: this.context
    });

    // optional, we are setting up the @pnp/logging for debugging
    // Logger.activeLogLevel = LogLevel.Info;
    // Logger.subscribe(new ConsoleListener());

    return super.onInit();
  }

  public render(): void {
    if (!this.renderedOnce) {
      this.domElement.appendChild(this._componentElement);
    }

    this._koDescription(this.properties.description);
  }

  private _createComponentElement(tagName: string): HTMLElement {
    const componentElement: HTMLElement = document.createElement("div");
    componentElement.setAttribute(
      "data-bind",
      `component: { name: "${tagName}", params: $data }`
    );
    return componentElement;
  }

  private _registerComponent(tagName: string): void {
    ko.components.register(tagName, {
      viewModel: SpfxPnpJsExampleViewModel,
      template: require("./SpfxPnpJsExample.template.html"),
      synchronous: false
    });
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

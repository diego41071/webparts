import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./Webpart2WebPart.module.scss";
import * as strings from "Webpart2WebPartStrings";

export interface IWebpart2WebPartProps {
  description: string;
}

export default class Webpart2WebPart extends BaseClientSideWebPart<
  IWebpart2WebPartProps
> {
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.webpart2}">
        <div class="${styles.container}">
          <div class="${styles.row}">
            <div class="${styles.column}">
              <span class="${styles.title}">Lista de catálogos</span>
              <p class="${styles.subTitle}">Título de catálogo</p>
              <p class="${styles.subTitle}">Url</p>
              <p class="${styles.subTitle}">Descripción</p>
              <a href="https://aka.ms/spfx" class="${styles.button}">
                <span class="${styles.label}">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
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

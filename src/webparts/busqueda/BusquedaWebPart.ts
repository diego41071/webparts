import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./BusquedaWebPart.module.scss";
import * as strings from "BusquedaWebPartStrings";

export interface IBusquedaWebPartProps {
  description: string;
}

export default class BusquedaWebPart extends BaseClientSideWebPart<
  IBusquedaWebPartProps
> {
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.busqueda}">
        <div class="${styles.container}">
          <div class="${styles.row}">
            <div class="${styles.column}">
              <span class="${styles.title}">Catálogo de servicios</span></br>
              <input type="text"></input>
              <button>Buscar</button>
              <p class="${styles.subTitle}">Proceso</p>              
              <p class="${styles.subTitle}">Título</p>              
              <p class="${styles.subTitle}">Descripción</p>
              <p class="${styles.subTitle}">Imagen</p>
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

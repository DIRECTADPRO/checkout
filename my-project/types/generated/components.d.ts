import type { Schema, Struct } from '@strapi/strapi';

export interface ConfigBump extends Struct.ComponentSchema {
  collectionName: 'components_config_bumps';
  info: {
    description: 'Order bump details';
    displayName: 'Bump';
    icon: 'cash';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    headline: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.Integer & Schema.Attribute.Required;
    stripePriceId: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ConfigCheckout extends Struct.ComponentSchema {
  collectionName: 'components_config_checkouts';
  info: {
    description: 'Main product information';
    displayName: 'Checkout';
    icon: 'shoppingCart';
  };
  attributes: {
    features: Schema.Attribute.Component<'shared.feature', true>;
    headline: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.String;
    price: Schema.Attribute.Integer & Schema.Attribute.Required;
    productName: Schema.Attribute.String & Schema.Attribute.Required;
    stripePriceId: Schema.Attribute.String;
    subhead: Schema.Attribute.Text;
  };
}

export interface ConfigOto extends Struct.ComponentSchema {
  collectionName: 'components_config_otos';
  info: {
    displayName: 'OTO';
    icon: 'video';
  };
  attributes: {
    features: Schema.Attribute.Component<'shared.feature', true>;
    headline: Schema.Attribute.String;
    price: Schema.Attribute.Integer & Schema.Attribute.Required;
    retailPrice: Schema.Attribute.Integer;
    stripePriceId: Schema.Attribute.String;
    videoEmbedUrl: Schema.Attribute.String;
    videoPlaceholder: Schema.Attribute.String;
  };
}

export interface ConfigTheme extends Struct.ComponentSchema {
  collectionName: 'components_config_themes';
  info: {
    displayName: 'Theme';
    icon: 'brush';
  };
  attributes: {
    accentColor: Schema.Attribute.String & Schema.Attribute.Required;
    backgroundColor: Schema.Attribute.String & Schema.Attribute.Required;
    logoUrl: Schema.Attribute.String & Schema.Attribute.Required;
    logoWidth: Schema.Attribute.String & Schema.Attribute.Required;
    primaryColor: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    displayName: 'Feature';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'config.bump': ConfigBump;
      'config.checkout': ConfigCheckout;
      'config.oto': ConfigOto;
      'config.theme': ConfigTheme;
      'shared.feature': SharedFeature;
    }
  }
}

export const SOURCE_TO_DB_FIELD_MAP = {
  CampaignNumber: 'campaign_number',
  Status: 'status',
  Updated: 'updated_source_at',
  ToPODate: 'topo_date',
  FirstClassDate: 'first_class_date',
  SecondClassDate: 'second_class_date',
  ITQuantity: 'list_size',
  Brochure: 'brochure',
  Age: 'age',
  IPA: 'ipa',
  EstimatedIncome: 'estimated_income',
  PremiumIncome: 'premium_income',
  Networth: 'networth',
  ZipCodes: 'zip_codes',
  RegURL: 'reg_url',
  FileManagerLink: 'file_manager_link',
  Venue1: 'venue',
  DigitalPackage: 'digital_package',
} as const;

export const IMPORTED_FIELDS = Object.values(SOURCE_TO_DB_FIELD_MAP);

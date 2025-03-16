const PRINT_STYLES = {
    base: `
    body {
      -webkit-print-color-adjust: exact;
      margin: 0;
      padding: 0;
    }
    @media print {
      html, body {
        height: initial !important;
        overflow: initial !important;
      }
    }
  `,
};

export const createPrintStyle = (width: number, height: number, backgroundImage?: string) => `
  @page {
    size: ${width}cm ${height}cm;
    margin: 0;
  }
  ${backgroundImage ? `background-image: url(${backgroundImage});` : ''}
  ${PRINT_STYLES.base}
`;

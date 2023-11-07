import { Section } from '@amwp/platform-ui-automation/lib/common/page-objects/section';

export class CaaSSection extends Section {
  constructor() {
    super();
    this.buildProps({
      caas: '#caas',
      caasFragment: '.fragment[data-path*="caas"]>>nth=0',
      caasButton: 'a[data-testid="consonant-BtnInfobit"] >> visible=true'
    });
  }
}

import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'Icarbonx 首页',
          title: 'Icarbonx 首页',
          href: 'https://www.icarbonx.com/',
          blankTarget: true,
        },
        // {
        //   key: 'github',
        //   title: <Icon type="github" />,
        //   href: 'https://github.com/ant-design/ant-design-pro',
        //   blankTarget: true,
        // },
        {
          key: 'Boss 首页',
          title: 'Boss 首页',
          href: 'https://boss.icarbonx.com/bossweb/',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 碳云智能信息系统部出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;

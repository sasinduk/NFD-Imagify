import React, { useState } from 'react';
import { Checkbox, Button, Dropdown, Menu, Popover } from 'antd';
import { SettingOutlined, DownOutlined } from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

type FloatingSettingsProps = {
  onSelectedValueCategoryChange: (value: string) => void;
  onSelectedValueGradingChange: (value: string) => void;
  onSelectedValueTypeChange: (value: string) => void;
  onSelectedValueRealismChange: (value: string) => void;
  onSelectedValueBackgroundChange: (value: string) => void;
  onSelectedValueAspectRatioChange: (value: string) => void;
  onChecked: (value: boolean) => void;
};

const FloatingSettings: React.FC<FloatingSettingsProps> = ({ onSelectedValueCategoryChange, onSelectedValueGradingChange, 
  onSelectedValueTypeChange, onSelectedValueRealismChange, onSelectedValueBackgroundChange, 
  onSelectedValueAspectRatioChange, onChecked }) => {
  const [selectedValueCategory, setSelectedValueCategory] = useState<string | null>(null);
  const [selectedValueGrading, setSelectedValueGrading] = useState<string | null>(null);
  const [selectedValueType, setSelectedValueType] = useState<string | null>(null);
  const [selectedValueRealism, setSelectedValueRealism] = useState<string | null>(null);
  const [selectedValueBackground, setSelectedValueBackground] = useState<string | null>(null);
  const [selectedValueAspectRatio, setSelectedValueAspectRatio] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleMenuClick = (dropdownName: string, e: MenuInfo) => {
    const selectedValue = e.key as string;

    if (dropdownName === 'category') {
      setSelectedValueCategory(selectedValue);
      onSelectedValueCategoryChange(selectedValue);
    } else if (dropdownName === 'grading') {
      setSelectedValueGrading(selectedValue);
      onSelectedValueGradingChange(selectedValue);
    } else if (dropdownName === 'type') {
      setSelectedValueType(selectedValue);
      onSelectedValueTypeChange(selectedValue);
    } else if (dropdownName === 'realism') {
      setSelectedValueRealism(selectedValue);
      onSelectedValueRealismChange(selectedValue);
    } else if (dropdownName === 'background') {
      setSelectedValueBackground(selectedValue);
      onSelectedValueBackgroundChange(selectedValue);
    } else if (dropdownName === 'aspectRatio') {
      setSelectedValueAspectRatio(selectedValue);
      onSelectedValueAspectRatioChange(selectedValue);
    }
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setIsChecked(e.target.checked);
    onChecked(e.target.checked);
  };

  const category = (
    <Menu onClick={(e) => handleMenuClick('category', e)}>
      <Menu.Item key="Documentary Travel Photography">Documentary travel photography</Menu.Item>
      <Menu.Item key="Macro Product Phography">Macro Product Phography</Menu.Item>
      <Menu.Item key="Macro Photgraphy">Macro photgraphy</Menu.Item>
      <Menu.Item key="Commercial Photography">Commercial Photography</Menu.Item>
      <Menu.Item key="Close-up Shot">Close-up shot</Menu.Item>
      <Menu.Item key="Top-Down View">Top-Down View</Menu.Item>
    </Menu>
  );

  const grading = (
    <Menu onClick={(e) => handleMenuClick('grading', e)}>
      <Menu.Item key="Film Photography">Film Photography</Menu.Item>
      <Menu.Item key="Triadic Color">Triadic Color</Menu.Item>
      <Menu.Item key="Moody Color Grading">Moody color grading</Menu.Item>
      <Menu.Item key="Vintage Color Grading">Vintage color grading</Menu.Item>
    </Menu>
  );

  const type = (
    <Menu onClick={(e) => handleMenuClick('type', e)}>
      <Menu.Item key="Modern">Modern</Menu.Item>
      <Menu.Item key="Minamilistic">minamilistic</Menu.Item>
    </Menu>
  );

  const realism = (
    <Menu onClick={(e) => handleMenuClick('realism', e)}>
      <Menu.Item key="Ultra-realistic">Ultra-realistic</Menu.Item>
      <Menu.Item key="Hyper-relastic">Hyper-relastic</Menu.Item>
      <Menu.Item key="Realistic">Realistic</Menu.Item>
    </Menu>
  );

  const background = (
    <Menu onClick={(e) => handleMenuClick('background', e)}>
      <Menu.Item key="Light">Light</Menu.Item>
      <Menu.Item key="White">White</Menu.Item>
      <Menu.Item key="Dark">Dark</Menu.Item>
    </Menu>
  );

  const aspectRatio = (
    <Menu onClick={(e) => handleMenuClick('aspectRatio', e)}>
      <Menu.Item key="1:1 Default Aspect Ratio">1:1 Default aspect ratio</Menu.Item>
      <Menu.Item key="5:4 Common Frame and Print Ratio">5:4 Common frame and print ratio</Menu.Item>
      <Menu.Item key="3:2 Common in Print Photography">3:2 Common in print photography</Menu.Item>
      <Menu.Item key="7:4 Close to HD TV Screens and Smartphone Screens">7:4 Close to HD TV screens and smartphone screens</Menu.Item>
    </Menu>
  );

  const content = (
    <div style={{ padding: '16px' }}>
      <div>
        <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
          Version 5
        </Checkbox>
      </div>
      <div style={{ margin: '16px 0' }}>
        <Dropdown overlay={category} placement="bottomRight" arrow>
          <Button>{selectedValueCategory || 'Category'}</Button>
        </Dropdown>
      </div>
      <div style={{ margin: '16px 0' }}>
        <Dropdown overlay={grading} placement="bottomRight" arrow>
          <Button>{selectedValueGrading || 'Grading'}</Button>
        </Dropdown>
      </div>
      <div style={{ margin: '16px 0' }}>
        <Dropdown overlay={type} placement="bottomRight" arrow>
          <Button>{selectedValueType || 'Type'}</Button>
        </Dropdown>
      </div>
      <div style={{ margin: '16px 0' }}>
        <Dropdown overlay={realism} placement="bottomRight" arrow>
          <Button>{selectedValueRealism || 'Realism'}</Button>
        </Dropdown>
      </div>
      <div style={{ margin: '16px 0' }}>
        <Dropdown overlay={background} placement="bottomRight" arrow>
          <Button>{selectedValueBackground || 'Background'}</Button>
        </Dropdown>
      </div>
      <div style={{ margin: '16px 0' }}>
        <Dropdown overlay={aspectRatio} placement="bottomRight" arrow>
          <Button>
            {selectedValueAspectRatio ? `Aspect Ratio: ${selectedValueAspectRatio}` : 'Aspect Ratio'}
          </Button>
        </Dropdown>
      </div>
    </div>
  );

  return (
    <div>
      <Popover
        placement="bottomRight"
        title="Configuration"
        content={content}
        trigger="click"
      >
        <SettingOutlined style={{ fontSize: '24px', color: '#1890ff', cursor: 'pointer' }} />
      </Popover>
      
      {/* Other components or content */}
      {/* <FloatingSettings
        selectedValueCategory={selectedValueCategory}
        setSelectedValueCategory={setSelectedValueCategory}
      /> */}
  </div>
  );
};


export default FloatingSettings;
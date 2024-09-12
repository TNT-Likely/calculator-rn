import {Picker, Text, View, Icon} from '@ant-design/react-native';
import React, {useState} from 'react';
import type {PickerValue} from '@ant-design/react-native';
import {TouchableOpacity} from 'react-native';

type IValue = number | string;

const Select: React.FC<{
  value?: IValue;
  onChange?: (value: IValue) => void;
  data: Array<{label: string; value: IValue}>;
}> = props => {
  const [visible, setVisible] = useState<boolean>();

  const label = props.data?.find(v => v.value === props.value)?.label;

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: '#000', fontSize: 17}}>{label}</Text>
          <Icon
            style={{verticalAlign: 'middle'}}
            name="right"
            size={12}
            color="#000"
          />
        </View>
      </TouchableOpacity>
      <Picker
        data={props.data}
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
        value={[props.value]}
        onOk={(v: PickerValue) => {
          props.onChange(v?.[0]);
        }}
      />
    </>
  );
};

export default Select;

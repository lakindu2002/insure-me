import { CustomButton } from '@insureme/common/CustomButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ClaimNavigatorParamList } from './ClaimNavigator';

type ClaimNewScreenNavigatorProps = NativeStackScreenProps<
  ClaimNavigatorParamList,
  'NewClaim'
>;

interface ClaimNewScreenProps extends ClaimNewScreenNavigatorProps { }

const DetailsStep = () => {
  return (
    <View>

    </View>
  );
};

const DocumentsStep = () => {
  return (
    <View>

    </View>
  )
};

const steps = [
  {
    title: 'Provide Claim Information',
    component: DetailsStep,
  },
  {
    title: 'Provide Claim Documents',
    component: DocumentsStep,
  }
]

export const ClaimNewScreen: FC<ClaimNewScreenProps> = ({ navigation }) => {
  const [selectedStep, setSelectedStep] = useState<number>(0);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: steps[selectedStep].title,
    });
  }, [selectedStep]);

  const getPositiveLabel = () => {
    if (selectedStep === steps.length) {
      return 'Submit Claim';
    }
    return 'Next'
  }

  const handlePositiveAction = () => {
    if (selectedStep === 0) {
      setSelectedStep(1);
      return;
    }
    // create claim
  };

  return (
    <ScrollView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
        }}
      >
        {
          selectedStep === 1 && <CustomButton
            label={'Back'}
            color='error'
            onPress={() => setSelectedStep(0)}
            mode='outlined'
            style={{
              marginRight: 15
            }}
          />
        }
        <CustomButton
          mode='contained'
          color='primary'
          onPress={handlePositiveAction}
          label={getPositiveLabel()}
        />
      </View>
    </ScrollView>
  );
};

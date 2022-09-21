import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/User.type';
import { FloatingActionButton } from '@insureme/common/FloatingActionButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useLayoutEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SceneMap, TabView } from 'react-native-tab-view';
import { ClaimStatus } from './Claim.type';
import { getClaimStatusName } from './Claim.util';
import { ClaimList } from './ClaimList';
import { ClaimNavigatorParamList } from './ClaimNavigator';
import { useClaims } from './ClaimsContext';

type ClaimListScreenNavigationProp = NativeStackScreenProps<ClaimNavigatorParamList, 'ClaimList'>;

interface ClaimListScreenProps extends ClaimListScreenNavigationProp { }

const renderScene = SceneMap({
  [ClaimStatus.PROCESSING]: ClaimList,
  [ClaimStatus.APPROVED]: ClaimList,
  [ClaimStatus.PENDING]: ClaimList,
  [ClaimStatus.REJECTED]: ClaimList,
})

const tabs = [
  {
    key: ClaimStatus.PENDING,
    title: getClaimStatusName(ClaimStatus.PENDING),
  },
  {
    key: ClaimStatus.PROCESSING,
    title: getClaimStatusName(ClaimStatus.PROCESSING),
  },
  {
    key: ClaimStatus.APPROVED,
    title: getClaimStatusName(ClaimStatus.APPROVED),
  },
  {
    key: ClaimStatus.REJECTED,
    title: getClaimStatusName(ClaimStatus.REJECTED),
  }
]

export const ClaimListScreen: FC<ClaimListScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const layout = useWindowDimensions();
  const { updateSelectedClaimStatus } = useClaims();
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const theme = useTheme();

  const stylesheet = useMemo(() => StyleSheet.create({
    tabItem: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 13,
      paddingVertical: 16,
      fontWeight: 600,
      color: theme.colors.text,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
    }
  }), [theme]);

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      headerShown: false
    });
  }, []);

  const handleOnNewClaimPressed = () => {
    console.log('new claim pressed');
  };

  const handleTabChange = (index: number) => {
    const tab = tabs[index];
    updateSelectedClaimStatus(tab.key);
    setCurrentTabIndex(index);
  }

  return (
    <>
      <TabView
        onIndexChange={(index) => {
          handleTabChange(index);
        }}
        navigationState={{
          index: currentTabIndex,
          routes: tabs,
        }}
        renderScene={renderScene}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => {
          const inputRange = props.navigationState.routes.map((_route, i) => i);
          return (<View style={stylesheet.tabBar}>
            {props.navigationState.routes.map((route, index) => (
              <TouchableOpacity
                onPress={() => handleTabChange(index)}
                key={route.key}
                style={stylesheet.tabItem}>
                <Animated.Text
                  style={{
                    opacity: props.position.interpolate({
                      inputRange,
                      outputRange: inputRange.map((inputIndex: number) =>
                        inputIndex === index ? 1 : 0.4
                      ),
                    }),
                    color: index === currentTabIndex ? theme.colors.primary : theme.colors.text,
                  }}
                >{route.title}
                </Animated.Text>
              </TouchableOpacity>
            ))}
          </View>)
        }}
      />
      {user?.role === UserRole.CUSTOMER && (
        <FloatingActionButton onPress={handleOnNewClaimPressed} />
      )}
    </>
  );
};

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiBadge,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSplitPanel,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import type { PropsWithChildren } from 'react';
import React, { type FC } from 'react';
import { i18n } from '@kbn/i18n';
import { PanelHeaderItems } from './panel_header_items';
import { useCurrentThemeVars } from '../../contexts/kibana';

export interface CollapsiblePanelProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  header: React.ReactElement;
  headerItems?: React.ReactElement[];
  ariaLabel: string;
}

export const CollapsiblePanel: FC<PropsWithChildren<CollapsiblePanelProps>> = ({
  isOpen,
  onToggle,
  children,
  header,
  headerItems,
  ariaLabel,
}) => {
  const { euiTheme } = useCurrentThemeVars();

  return (
    <EuiSplitPanel.Outer
      grow
      hasShadow={false}
      css={{
        border: `${euiTheme.euiBorderWidthThin} solid ${
          isOpen ? euiTheme.euiBorderColor : 'transparent'
        }`,
      }}
    >
      <EuiSplitPanel.Inner color={isOpen ? 'plain' : 'subdued'}>
        <EuiFlexGroup justifyContent={'spaceBetween'} alignItems={'center'}>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize={'s'}>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  aria-label={
                    isOpen
                      ? i18n.translate('xpack.ml.collapsiblePanel.toggleClose', {
                          defaultMessage: 'Close {ariaLabel}',
                          values: { ariaLabel },
                        })
                      : i18n.translate('xpack.ml.collapsiblePanel.toggleOpen', {
                          defaultMessage: 'Open {ariaLabel}',
                          values: { ariaLabel },
                        })
                  }
                  color={'text'}
                  iconType={isOpen ? 'arrowDown' : 'arrowRight'}
                  onClick={() => {
                    onToggle(!isOpen);
                  }}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiTitle size="xxs">
                  <h2>{header}</h2>
                </EuiTitle>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          {headerItems ? (
            <EuiFlexItem grow={false}>
              <PanelHeaderItems headerItems={headerItems} />
            </EuiFlexItem>
          ) : null}
        </EuiFlexGroup>
      </EuiSplitPanel.Inner>
      {isOpen ? (
        <EuiSplitPanel.Inner
          css={{ borderTop: `${euiTheme.euiBorderWidthThin} solid ${euiTheme.euiBorderColor}` }}
          grow={false}
        >
          {children}
        </EuiSplitPanel.Inner>
      ) : null}
    </EuiSplitPanel.Outer>
  );
};

export interface StatEntry {
  label: string;
  value: number;
  'data-test-subj'?: string;
}

export interface OverviewStatsBarProps {
  inputStats: StatEntry[];
  dataTestSub?: string;
}

export const OverviewStatsBar: FC<OverviewStatsBarProps> = ({ inputStats, dataTestSub }) => {
  return (
    <EuiFlexGroup data-test-subj={dataTestSub} alignItems={'center'} gutterSize={'m'}>
      {inputStats.map(({ value, label, 'data-test-subj': dataTestSubjValue }) => {
        return (
          <EuiFlexItem grow={false} key={label}>
            <EuiFlexGroup alignItems={'center'} gutterSize={'s'}>
              <EuiFlexItem grow={false}>
                <EuiText size={'s'}>{label}:</EuiText>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiBadge data-test-subj={dataTestSubjValue}>{value}</EuiBadge>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        );
      })}
    </EuiFlexGroup>
  );
};

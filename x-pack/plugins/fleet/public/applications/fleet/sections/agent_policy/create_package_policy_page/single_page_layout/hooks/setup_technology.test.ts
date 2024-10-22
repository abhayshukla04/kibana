/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { renderHook, act } from '@testing-library/react-hooks';

import { waitFor } from '@testing-library/react';

import { createPackagePolicyMock } from '../../../../../../../../common/mocks';

import { SetupTechnology } from '../../../../../../../../common/types';
import { useStartServices, useConfig } from '../../../../../hooks';
import { SelectedPolicyTab } from '../../components';
import { generateNewAgentPolicyWithDefaults } from '../../../../../../../../common/services/generate_new_agent_policy';

import { useAgentless, useSetupTechnology } from './setup_technology';

jest.mock('../../../../../services');
jest.mock('../../../../../hooks', () => ({
  ...jest.requireActual('../../../../../hooks'),
  sendGetOneAgentPolicy: jest.fn(),
  useStartServices: jest.fn(),
  useConfig: jest.fn(),
}));
jest.mock('../../../../../../../../common/services/generate_new_agent_policy');

type MockFn = jest.MockedFunction<any>;

describe('useAgentless', () => {
  beforeEach(() => {
    (useConfig as MockFn).mockReturnValue({
      agentless: undefined,
    } as any);
    (useStartServices as MockFn).mockReturnValue({
      cloud: {
        isServerlessEnabled: false,
        isCloudEnabled: false,
      },
    });
    jest.clearAllMocks();
  });

  it('should return isAgentlessEnabled as falsy when agentless is not enabled', () => {
    const { result } = renderHook(() => useAgentless());

    expect(result.current.isAgentlessEnabled).toBeFalsy();
  });

  it('should return isAgentlessEnabled as falsy if agentless.enabled true without cloud or serverless', () => {
    (useConfig as MockFn).mockReturnValue({
      agentless: {
        enabled: true,
      },
    } as any);

    const { result } = renderHook(() => useAgentless());

    expect(result.current.isAgentlessEnabled).toBeFalsy();
  });

  it('should return isAgentlessEnabled as truthy with isCloudEnabled', () => {
    (useConfig as MockFn).mockReturnValue({
      agentless: {
        enabled: true,
      },
    } as any);

    (useStartServices as MockFn).mockReturnValue({
      cloud: {
        isServerlessEnabled: false,
        isCloudEnabled: true,
      },
    });

    const { result } = renderHook(() => useAgentless());

    expect(result.current.isAgentlessEnabled).toBeTruthy();
  });

  it('should return isAgentlessEnabled truthy with isServerlessEnabled', () => {
    (useStartServices as MockFn).mockReturnValue({
      cloud: {
        isServerlessEnabled: true,
        isCloudEnabled: false,
      },
    });

    (useConfig as MockFn).mockReturnValue({
      agentless: {
        enabled: true,
      },
    } as any);

    const { result } = renderHook(() => useAgentless());

    expect(result.current.isAgentlessEnabled).toBeTruthy();
  });

  it('should return isAgentlessEnabled as falsy with isServerlessEnabled and without agentless config', () => {
    (useStartServices as MockFn).mockReturnValue({
      cloud: {
        isServerlessEnabled: true,
        isCloudEnabled: false,
      },
    });

    const { result } = renderHook(() => useAgentless());

    expect(result.current.isAgentlessEnabled).toBeFalsy();
  });
});

describe('useSetupTechnology', () => {
  const setNewAgentPolicy = jest.fn();
  const updateAgentPoliciesMock = jest.fn();
  const setSelectedPolicyTabMock = jest.fn();
  const newAgentPolicyMock = {
    name: 'mock_new_agent_policy',
    namespace: 'default',
    is_managed: false,
    supports_agentless: false,
    inactivity_timeout: 3600,
  };
  const packagePolicyMock = createPackagePolicyMock();

  beforeEach(() => {
    (useConfig as MockFn).mockReturnValue({
      agentless: undefined,
    } as any);
    (useStartServices as MockFn).mockReturnValue({
      cloud: {
        isServerlessEnabled: true,
      },
    });

    (generateNewAgentPolicyWithDefaults as MockFn).mockReturnValue({
      name: 'Agentless policy for endpoint-1',
      supports_agentless: true,
      inactivity_timeout: 3600,
    });
    jest.clearAllMocks();
  });

  it('should initialize with default values when agentless is disabled', () => {
    const { result } = renderHook(() =>
      useSetupTechnology({
        setNewAgentPolicy,
        newAgentPolicy: newAgentPolicyMock,
        updateAgentPolicies: updateAgentPoliciesMock,
        setSelectedPolicyTab: setSelectedPolicyTabMock,
        packagePolicy: packagePolicyMock,
      })
    );

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENT_BASED);
  });

  it('should set agentless setup technology if agent policy supports agentless in edit page', async () => {
    (useConfig as MockFn).mockReturnValue({
      agentless: {
        enabled: true,
        api: {
          url: 'https://agentless.api.url',
        },
      },
    } as any);
    (useStartServices as MockFn).mockReturnValue({
      cloud: {
        isCloudEnabled: true,
      },
    });
    const { result } = renderHook(() =>
      useSetupTechnology({
        setNewAgentPolicy,
        newAgentPolicy: newAgentPolicyMock,
        updateAgentPolicies: updateAgentPoliciesMock,
        setSelectedPolicyTab: setSelectedPolicyTabMock,
        packagePolicy: packagePolicyMock,
        isEditPage: true,
        agentPolicies: [{ id: 'agentless-policy-id', supports_agentless: true } as any],
      })
    );

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENTLESS);
  });

  it('should create agentless policy if isCloud  and agentless.enabled', async () => {
    (useConfig as MockFn).mockReturnValue({
      agentless: {
        enabled: true,
        api: {
          url: 'https://agentless.api.url',
        },
      },
    } as any);
    (useStartServices as MockFn).mockReturnValue({
      cloud: {
        isCloudEnabled: true,
      },
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useSetupTechnology({
        setNewAgentPolicy,
        newAgentPolicy: newAgentPolicyMock,
        updateAgentPolicies: updateAgentPoliciesMock,
        setSelectedPolicyTab: setSelectedPolicyTabMock,
        packagePolicy: packagePolicyMock,
      })
    );

    expect(generateNewAgentPolicyWithDefaults).toHaveBeenCalled();

    act(() => {
      result.current.handleSetupTechnologyChange(SetupTechnology.AGENTLESS);
    });

    waitForNextUpdate();

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENTLESS);
    expect(setNewAgentPolicy).toHaveBeenCalledWith({
      name: 'Agentless policy for endpoint-1',
      supports_agentless: true,
      inactivity_timeout: 3600,
    });
  });

  it('should update agentless policy name to match integration name if agentless is enabled', async () => {
    (useConfig as MockFn).mockReturnValue({
      agentless: {
        enabled: true,
        api: {
          url: 'https://agentless.api.url',
        },
      },
    } as any);
    (useStartServices as MockFn).mockReturnValue({
      cloud: {
        isCloudEnabled: true,
      },
    });
    const { result, rerender } = renderHook(() =>
      useSetupTechnology({
        setNewAgentPolicy,
        newAgentPolicy: newAgentPolicyMock,
        updateAgentPolicies: updateAgentPoliciesMock,
        setSelectedPolicyTab: setSelectedPolicyTabMock,
        packagePolicy: packagePolicyMock,
      })
    );

    expect(generateNewAgentPolicyWithDefaults).toHaveBeenCalled();

    act(() => {
      result.current.handleSetupTechnologyChange(SetupTechnology.AGENTLESS);
    });

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENTLESS);
    expect(setNewAgentPolicy).toHaveBeenCalledWith({
      inactivity_timeout: 3600,
      name: 'Agentless policy for endpoint-1',
      supports_agentless: true,
    });

    rerender({
      setNewAgentPolicy,
      newAgentPolicy: newAgentPolicyMock,
      updateAgentPolicies: updateAgentPoliciesMock,
      setSelectedPolicyTab: setSelectedPolicyTabMock,
      packagePolicy: {
        ...packagePolicyMock,
        name: 'endpoint-2',
      },
    });

    waitFor(() => {
      expect(setNewAgentPolicy).toHaveBeenCalledWith({
        name: 'Agentless policy for endpoint-2',
        inactivity_timeout: 3600,
        supports_agentless: true,
      });
    });
  });

  it('should not create agentless policy isCloud is true and agentless.api.url is not defined', async () => {
    (useConfig as MockFn).mockReturnValue({} as any);
    (useStartServices as MockFn).mockReturnValue({
      cloud: {
        isCloudEnabled: true,
      },
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useSetupTechnology({
        setNewAgentPolicy,
        newAgentPolicy: newAgentPolicyMock,
        updateAgentPolicies: updateAgentPoliciesMock,
        setSelectedPolicyTab: setSelectedPolicyTabMock,
        packagePolicy: packagePolicyMock,
      })
    );

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENT_BASED);

    act(() => {
      result.current.handleSetupTechnologyChange(SetupTechnology.AGENT_BASED);
    });

    waitForNextUpdate();
    expect(setNewAgentPolicy).toHaveBeenCalledTimes(0);
  });

  it('should update new agent policy and selected policy tab when setup technology is agent-based', async () => {
    (useConfig as MockFn).mockReturnValue({
      agentless: {
        enabled: true,
        api: {
          url: 'https://agentless.api.url',
        },
      },
    } as any);
    (useStartServices as MockFn).mockReturnValue({
      cloud: {
        isCloudEnabled: true,
      },
    });

    const { result } = renderHook(() =>
      useSetupTechnology({
        setNewAgentPolicy,
        newAgentPolicy: newAgentPolicyMock,
        updateAgentPolicies: updateAgentPoliciesMock,
        setSelectedPolicyTab: setSelectedPolicyTabMock,
        packagePolicy: packagePolicyMock,
      })
    );

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENT_BASED);

    act(() => {
      result.current.handleSetupTechnologyChange(SetupTechnology.AGENTLESS);
    });

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENTLESS);

    act(() => {
      result.current.handleSetupTechnologyChange(SetupTechnology.AGENT_BASED);
    });

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENT_BASED);

    expect(setNewAgentPolicy).toHaveBeenCalledWith(newAgentPolicyMock);
    expect(setSelectedPolicyTabMock).toHaveBeenCalledWith(SelectedPolicyTab.NEW);
  });

  it('should not update agent policy and selected policy tab when setup technology matches the current one ', async () => {
    const { result } = renderHook(() =>
      useSetupTechnology({
        setNewAgentPolicy,
        newAgentPolicy: newAgentPolicyMock,
        updateAgentPolicies: updateAgentPoliciesMock,
        setSelectedPolicyTab: setSelectedPolicyTabMock,
        packagePolicy: packagePolicyMock,
      })
    );

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENT_BASED);

    act(() => {
      result.current.handleSetupTechnologyChange(SetupTechnology.AGENT_BASED);
    });

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENT_BASED);

    expect(setNewAgentPolicy).not.toHaveBeenCalled();
    expect(setSelectedPolicyTabMock).not.toHaveBeenCalled();
  });

  it('should revert the agent policy name to the original value when switching from agentless back to agent-based', async () => {
    const { result } = renderHook(() =>
      useSetupTechnology({
        setNewAgentPolicy,
        newAgentPolicy: newAgentPolicyMock,
        updateAgentPolicies: updateAgentPoliciesMock,
        setSelectedPolicyTab: setSelectedPolicyTabMock,
        packagePolicy: packagePolicyMock,
      })
    );

    expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENT_BASED);

    act(() => {
      result.current.handleSetupTechnologyChange(SetupTechnology.AGENTLESS);
    });

    waitFor(() => {
      expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENTLESS);
    });

    waitFor(() => {
      expect(setNewAgentPolicy).toHaveBeenCalledWith({
        name: 'Agentless policy for endpoint-1',
        supports_agentless: true,
        inactivity_timeout: 3600,
      });
    });

    act(() => {
      result.current.handleSetupTechnologyChange(SetupTechnology.AGENT_BASED);
    });

    waitFor(() => {
      expect(result.current.selectedSetupTechnology).toBe(SetupTechnology.AGENT_BASED);
      expect(setNewAgentPolicy).toHaveBeenCalledWith(newAgentPolicyMock);
    });
  });
});

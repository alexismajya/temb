"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homebase = {
    id: 2,
    name: 'Nairobi',
    channel: 'CQBAAEZ42',
    addressId: 1,
    locationId: 39,
    currency: 'KES',
};
exports.payload = {
    type: 'block_actions',
    team: { id: 'TPDKFR8TF', domain: 'tembeaherve' },
    user: { id: 'UP0RTRL02',
        username: 'herve.nkurikiyimfura',
        name: 'herve.nkurikiyimfura',
        team_id: 'TPDKFR8TF' },
    api_app_id: 'AP76LSN9F',
    token: 'X1Mdhs51tctJfA5b8kbCCBro',
    container: { type: 'message',
        message_ts: '1578231687.000100',
        channel_id: 'CP256NYAF',
        is_ephemeral: true },
    trigger_id: '894202247861.795661858933.899a0b8177a32baf33bcb06e73d85dce',
    channel: { id: 'CP256NYAF', name: 'tembea' },
    response_url: 'https://hooks.slack.com/actions/TPDKFR8TF/881407979378/5Qz4NpcHARHDFA0F3mTbExQs',
    actions: [{ action_id: 'user_route_search_popup',
            block_id: 'user_route_search',
            text: [Object],
            value: 'search',
            style: 'primary',
            type: 'button',
            action_ts: '1578285964.294784' }],
    view: { id: 'VS9R7AFGU',
        team_id: 'TPDKFR8TF',
        type: 'modal',
        private_metadata: '"https://hooks.slack.com/actions/TPDKFR8TF/884085122337/swdPpUnPeLaFUV905q73HuvM"',
        callback_id: 'user_route_skip_page_submit',
    },
};
exports.dependencyMocks = {
    actionRespond: jest.fn(),
    modalRespond: {
        send: jest.fn(),
        clear: jest.fn(),
        update: jest.fn(),
        error: jest.fn(),
    },
};
exports.engagementObject = {
    startDate: '2/12/2019',
    endDate: '12/12/2019',
    partnerName: 'Hervera',
};
exports.blockMessage = {
    blocks: [
        { type: 'section', block_id: 1 },
        { type: 'divider', block_id: 2 },
        { type: 'section', block_id: 3 },
        {
            type: 'actions',
            block_id: 'user_route_block_60',
        },
    ],
};
exports.unCompletePayload = {
    user: {
        id: 'UP0RTRL02',
    },
    actions: [{
            action_id: 'user_route_action',
            block_id: 'user_route_block',
            value: '107',
        }],
};
exports.skipPayload = {
    type: 'block_actions',
    team: { id: 'TPDKFR8TF', domain: 'tembeaherve' },
    user: { id: 'UP0RTRL02',
        username: 'herve.nkurikiyimfura',
        name: 'herve.nkurikiyimfura',
        team_id: 'TPDKFR8TF' },
    api_app_id: 'AP76LSN9F',
    token: 'X1Mdhs51tctJfA5b8kbCCBro',
    container: { type: 'message',
        message_ts: '1578231687.000100',
        channel_id: 'CP256NYAF',
        is_ephemeral: true },
    trigger_id: '894202247861.795661858933.899a0b8177a32baf33bcb06e73d85dce',
    channel: { id: 'CP256NYAF', name: 'tembea' },
    response_url: 'https://hooks.slack.com/actions/TPDKFR8TF/881407979378/5Qz4NpcHARHDFA0F3mTbExQs',
    actions: [{
            action_id: 'user_route_page_2',
            block_id: 'user_route_pagination',
            value: 'availableRoutes_page_2',
            action_ts: '1578285964.294784'
        }],
    view: {
        private_metadata: '"https://hooks.slack.com/actions/TPDKFR8TF/884085122337/swdPpUnPeLaFUV905q73HuvM"',
        callback_id: 'user_route_skip_page_submit',
    },
};
//# sourceMappingURL=user-route-mocks.js.map
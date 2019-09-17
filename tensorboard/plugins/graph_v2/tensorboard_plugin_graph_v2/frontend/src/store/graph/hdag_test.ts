import { HdagNode, HdagRoot } from './hdag';

export const testHdag: HdagRoot = {
  path: [],
  children: {
    aaa: {
      path: ['aaa'],
      children: {
        ddd: {
          path: ['aaa', 'ddd'],
          children: {},
          outboundEdges: [['aaa', 'eee'], ['bbb', 'ggg'], ['ccc', 'jjj']],
        },
        eee: {
          path: ['aaa', 'eee'],
          children: {},
          outboundEdges: [['bbb', 'hhh'], ['aaa', 'fff']],
        },
        fff: {
          path: ['aaa', 'fff'],
          children: {},
          outboundEdges: [['ccc', 'kkk']],
        },
      },
      outboundEdges: [],
    },
    bbb: {
      path: ['bbb'],
      children: {
        ggg: {
          path: ['bbb', 'ggg'],
          children: {},
          outboundEdges: [],
        },
        hhh: {
          path: ['bbb', 'hhh'],
          children: {},
          outboundEdges: [['ccc', 'lll']],
        },
        iii: {
          path: ['bbb', 'iii'],
          children: {},
          outboundEdges: [],
        },
      },
      outboundEdges: [],
    },
    ccc: {
      path: ['ccc'],
      children: {
        jjj: {
          path: ['ccc', 'jjj'],
          children: {},
          outboundEdges: [['aaa', 'fff']],
        },
        kkk: {
          path: ['ccc', 'kkk'],
          children: {},
          outboundEdges: [],
        },
        lll: {
          path: ['ccc', 'lll'],
          children: {},
          outboundEdges: [],
        },
      },
      outboundEdges: [],
    },
  },
  outboundEdges: [],
};

import { CstNode, CstNodeLocation } from 'chevrotain';
import { parserInstance } from '../mainParser/noRecoveryParser';
import { recusiveGetToken, recusiveGetTokenString } from './recusiveGetToken';
import {
  ArgumentDirection,
  GlobalObjects,
  NodePosition,
  ObjectContext,
  ObjectType,
  PackageContent,
  PackageDef,
  VariableDef,
} from './types';

const BaseCstVisitor =
  parserInstance.getBaseCstVisitorConstructorWithDefaults();

function getPosition(l: CstNodeLocation): NodePosition {
  return {
    startLine: l.startLine,
    startOffset: l.startOffset,
    endLine: l.endLine,
    endColumn: l.endColumn,
  };
}

class PlSqlInterpreter extends BaseCstVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  global(ctx: any): GlobalObjects {
    const globalObjects = <GlobalObjects>{};

    if (ctx.createPackage && typeof ctx.createPackage.length !== 'undefined') {
      globalObjects.packages = [];

      ctx.createPackage.forEach((p: CstNode) =>
        globalObjects.packages.push(this.visit(p))
      );
    }

    return globalObjects;
  }

  createPackage(ctx: any): PackageDef {
    const pkg = <PackageDef>{};

    if (ctx.createPackageSpec && ctx.createPackageSpec[0]) {
      const ps = ctx.createPackageSpec[0];
      pkg.type = ObjectContext.spec;
      pkg.position = getPosition(ps.location);
      pkg.name = recusiveGetTokenString(ps.children.package_name);

      pkg.content = <PackageContent>{};
      if (ps.children.variableDeclaration) {
        pkg.content.variables = ps.children.variableDeclaration.map(
          (p: CstNode) => this.visit(p)
        );
      }

      if (ps.children.objectDeclaration) {
        pkg.content.objects = ps.children.objectDeclaration.map((p: CstNode) =>
          this.visit(p)
        );
      }
    } else if (ctx.createPackageBody && ctx.createPackageBody[0]) {
      const pb = ctx.createPackageBody[0];
      pkg.type = ObjectContext.body;
      pkg.position = getPosition(pb.location);
      pkg.name = recusiveGetTokenString(pb.children.package_name);

      pkg.content = <PackageContent>{};
      if (pb.children.variableDeclaration) {
        pkg.content.variables = pb.children.variableDeclaration.map(
          (p: CstNode) => this.visit(p)
        );
      }

      if (pb.children.objectDeclaration) {
        pkg.content.objects = pb.children.objectDeclaration.map((p: CstNode) =>
          this.visit(p)
        );
      }
    }
    return pkg;
  }

  variableDeclaration(ctx: any): VariableDef | null {
    const v = <VariableDef>{};

    console.log('variableDeclaration', ctx);
    if (ctx.standardVariableDeclaration[0]) {
      const sv = ctx.standardVariableDeclaration[0];
      console.log('standardVariableDeclaration', sv);

      v.position = getPosition(sv.location);
      v.name = recusiveGetTokenString(sv.children.variable_name);
      v.constant = !!sv.children.ConstantKw;
      if (sv.children.variableSpec) {
        v.type = recusiveGetTokenString(sv.children.variableSpec);
      }

      if (sv.children.value) {
        v.value = this.visit(sv.children.value);
      }

      return v;
    }

    return null;
  }

  value(ctx: any) {
    const values = recusiveGetToken(ctx);
    return values.join(' ');
  }

  objectDeclaration(ctx: any) {
    const obj = <any>{};

    if (ctx.funcSpec && ctx.funcSpec[0]) {
      const fs = ctx.funcSpec[0];

      obj.type = ObjectType.fc;
      obj.context = ObjectContext.spec;

      obj.position = getPosition(fs.location);

      if (fs?.children?.function_name) {
        obj.name = recusiveGetTokenString(fs.children.function_name);
      }

      if (fs?.children?.argumentList) {
        obj.arguments = this.visit(fs.children.argumentList);
      }

      if (fs?.children?.dataType) {
        obj.return = recusiveGetTokenString(fs.children.dataType);
      } else if (fs?.children?.objType) {
        obj.return = recusiveGetTokenString(fs.children.objType);
      }

      obj.deterministic = !!fs?.children?.DeterministicKw;
      obj.resultCache = !!fs?.children?.ResultCacheKw;
      obj.pipelined = !!fs?.children?.PipelinedKw;

      return obj;
    }

    if (ctx.procSpec && ctx.procSpec[0]) {
      const ps = ctx.procSpec[0];

      obj.type = ObjectType.prc;
      obj.context = ObjectContext.spec;

      obj.position = getPosition(ps.location);

      if (ps?.children?.procedure_name) {
        obj.name = recusiveGetTokenString(ps.children.procedure_name);
      }

      if (ps?.children?.argumentList) {
        obj.arguments = this.visit(ps.children.argumentList);
      }

      return obj;

      //debugger;
    }
  }

  argumentList(ctx: any) {
    const args: any[] = [];

    ctx.argument.forEach((arg: any) => {
      const a = <any>{};

      a.name = recusiveGetTokenString(arg.children.Identifier);
      a.dataType = recusiveGetTokenString(arg.children.dataType);

      if (!arg.children.inOut) {
        a.direction = ArgumentDirection.in;
      } else if (
        arg.children.inOut[0].children.InKw &&
        arg.children.inOut[0].children.OutKw
      ) {
        a.direction = ArgumentDirection.inOut;
      } else if (arg.children.inOut[0].children.InKw) {
        a.direction = ArgumentDirection.in;
      } else {
        a.direction = ArgumentDirection.out;
      }
      args.push(a);
    });

    return args;
  }
}

const plSqlInterpreter = new PlSqlInterpreter();

export default plSqlInterpreter;

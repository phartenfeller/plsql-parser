import { CstNode, CstNodeLocation } from 'chevrotain';
import { parserInstance } from '../mainParser/noRecoveryParser';
import { VariableDeclarationReturn, VarTypes } from './helperTypes';
import recusiveGetTokenString from './recusiveGetTokenString';
import {
  ArgumentDirection,
  ExceptionDef,
  GlobalObjects,
  NodePosition,
  ObjectContext,
  ObjectType,
  PackageContent,
  PackageDef,
  SimpleVariableDef,
  TypeClass,
  TypeDef,
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
        ps.children.variableDeclaration.forEach((vd: CstNode) => {
          const v: VariableDeclarationReturn = this.visit(vd);
          if (v.type === VarTypes.variable) {
            if (!pkg.content.variables) {
              pkg.content.variables = [v.def as VariableDef];
            } else {
              pkg.content.variables.push(v.def as VariableDef);
            }
          } else if (v.type === VarTypes.exception) {
            if (!pkg.content.exceptions) {
              pkg.content.exceptions = [v.def as ExceptionDef];
            } else {
              pkg.content.exceptions.push(v.def as ExceptionDef);
            }
          } else {
            throw new Error(`Unhandled variable type ${v.type}`);
          }
        });
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
      pkg.content.objects = [];
      if (pb.children.variableDeclaration) {
        pb.children.variableDeclaration.forEach((vd: CstNode) => {
          const v: VariableDeclarationReturn = this.visit(vd);
          if (v.type === VarTypes.variable) {
            if (!pkg.content.variables) {
              pkg.content.variables = [v.def as VariableDef];
            } else {
              pkg.content.variables.push(v.def as VariableDef);
            }
          } else if (v.type === VarTypes.exception) {
            if (!pkg.content.exceptions) {
              pkg.content.exceptions = [v.def as ExceptionDef];
            } else {
              pkg.content.exceptions.push(v.def as ExceptionDef);
            }
          } else {
            throw new Error(`Unhandled variable type ${v.type}`);
          }
        });
      }

      if (pb.children.objectDeclaration) {
        pkg.content.objects = pb.children.objectDeclaration.map((p: CstNode) =>
          this.visit(p)
        );
      }

      if (pb.children.packageObjSpec) {
        pb.children.packageObjSpec.forEach((p: CstNode) =>
          pkg.content.objects?.push(this.visit(p))
        );
      }

      if (pb.children.typeDefiniton) {
        pkg.content.types = pb.children.typeDefiniton.map((p: CstNode) => {
          const t = this.visit(p);
          if (p.location) {
            t.position = getPosition(p.location);
          }
          return t;
        });
      }
    }
    return pkg;
  }

  variableDeclaration(ctx: any): VariableDeclarationReturn | null {
    if (ctx.standardVariableDeclaration?.[0]) {
      const v = <VariableDef>{};
      const sv = ctx.standardVariableDeclaration[0];

      v.position = getPosition(sv.location);
      v.name = recusiveGetTokenString(sv.children.variable_name);
      v.constant = !!sv.children.ConstantKw;
      if (sv.children.variableSpec) {
        v.type = recusiveGetTokenString(sv.children.variableSpec);
      }

      if (sv.children.value) {
        v.value = this.visit(sv.children.value);
      }

      return { type: VarTypes.variable, def: v };
    } else if (ctx.exceptionDeclaration?.[0]) {
      const e = <ExceptionDef>{};
      e.position = getPosition(ctx.exceptionDeclaration[0].location);
      e.name = recusiveGetTokenString(
        ctx.exceptionDeclaration[0].children.exception_name
      );
      return { type: VarTypes.exception, def: e };
    }

    return null;
  }

  value(ctx: any) {
    return recusiveGetTokenString(ctx);
  }

  typeDefiniton(ctx: any) {
    const type = <TypeDef>{};

    type.type = ctx.type_table_type ? TypeClass.table : TypeClass.record;

    if (ctx?.type_name) {
      type.name = recusiveGetTokenString(ctx.type_name);
    }

    if (ctx.type_table_type) {
      type.tableOf = recusiveGetTokenString(ctx.type_table_type);
    }

    if (ctx.type_table_index) {
      type.tableIndex = recusiveGetTokenString(ctx.type_table_index);
    }

    if (
      ctx.type_record_variable_name?.length &&
      ctx.type_record_variable_name.length > 0
    ) {
      type.recordFields = [];

      for (let i = 0; i < ctx.type_record_variable_name.length; i++) {
        const field = <SimpleVariableDef>{};
        field.name = recusiveGetTokenString(ctx.type_record_variable_name[i]);
        field.type = recusiveGetTokenString(ctx.type_record_variable_type[i]);
        type.recordFields.push(field);
      }
    }

    return type;
  }

  objectDeclaration(ctx: any) {
    if (ctx.funcSpec && ctx.funcSpec[0]) {
      const fc = this.visit(ctx.funcSpec[0]);
      fc.position = getPosition(ctx.funcSpec[0].location);
      return fc;
    }

    if (ctx.procSpec && ctx.procSpec[0]) {
      const prc = this.visit(ctx.procSpec[0]);
      prc.position = getPosition(ctx.procSpec[0].location);
      return prc;
    }
  }

  funcSpec(ctx: any) {
    const obj = <any>{};

    obj.type = ObjectType.fc;
    obj.context = ObjectContext.spec;

    //obj.position = getPosition(ctx.location);

    if (ctx?.function_name) {
      obj.name = recusiveGetTokenString(ctx.function_name);
    }

    if (ctx?.argumentList) {
      obj.arguments = this.visit(ctx.argumentList);
    }

    if (ctx?.dataType) {
      obj.return = recusiveGetTokenString(ctx.dataType);
    } else if (ctx?.objType) {
      obj.return = recusiveGetTokenString(ctx.objType);
    }

    obj.deterministic = !!ctx?.DeterministicKw;
    obj.resultCache = !!ctx?.ResultCacheKw;
    obj.pipelined = !!ctx?.PipelinedKw;

    return obj;
  }

  procSpec(ctx: any) {
    const obj = <any>{};

    obj.type = ObjectType.prc;
    obj.context = ObjectContext.spec;

    // obj.position = getPosition(ctx.location);

    if (ctx?.procedure_name) {
      obj.name = recusiveGetTokenString(ctx.procedure_name);
    }

    if (ctx?.argumentList) {
      obj.arguments = this.visit(ctx.argumentList);
    }

    return obj;
  }

  packageObjSpec(ctx: any) {
    if (ctx.funcBody && ctx.funcBody[0] && ctx.funcBody[0].children.funcSpec) {
      const fc = this.visit(ctx.funcBody[0].children.funcSpec);
      fc.context = ObjectContext.body;
      fc.position = getPosition(ctx.funcBody[0].location);
      return fc;
    } else if (
      ctx.procBody &&
      ctx.procBody[0] &&
      ctx.procBody[0].children.procSpec
    ) {
      const prc = this.visit(ctx.procBody[0].children.procSpec);
      prc.context = ObjectContext.body;
      prc.position = getPosition(ctx.procBody[0].location);
      return prc;
    }
  }

  argumentList(ctx: any) {
    const args: any[] = [];

    ctx.argument.forEach((arg: any) => {
      const a = <any>{};

      a.name = recusiveGetTokenString(arg.children.Identifier);
      if (arg.children.dataType) {
        a.dataType = recusiveGetTokenString(arg.children.dataType);
      } else if (arg.children.objType) {
        a.dataType = recusiveGetTokenString(arg.children.objType);
      }

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

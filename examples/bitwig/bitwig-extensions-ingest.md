(Files content cropped to 300k characters, download full ingest to see more)
================================================
FILE: README.md
================================================
# bitwig-extensions
Bitwig Studio Controller Extensions

A scripting guide and API reference resides in Bitwig Studio under Help > Documentation > Developer Resources.

## JAVA codestyle

If you plan on contributing to this repository please import `code-formatting.xml` in your IDE.



================================================
FILE: bitwig-extensions.iml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<module org.jetbrains.idea.maven.project.MavenProjectsManager.isMavenModule="true" version="4">
  <component name="ExternalSystem" externalSystem="Maven" />
  <component name="NewModuleRootManager" LANGUAGE_LEVEL="JDK_19">
    <output url="file://$MODULE_DIR$/target/classes" />
    <output-test url="file://$MODULE_DIR$/target/test-classes" />
    <content url="file://$MODULE_DIR$">
      <sourceFolder url="file://$MODULE_DIR$/src/main/java" isTestSource="false" />
      <sourceFolder url="file://$MODULE_DIR$/src/main/resources" type="java-resource" />
      <sourceFolder url="file://$MODULE_DIR$/src/test/java" isTestSource="true" />
      <excludeFolder url="file://$MODULE_DIR$/target" />
    </content>
    <orderEntry type="inheritedJdk" />
    <orderEntry type="sourceFolder" forTests="false" />
    <orderEntry type="library" name="Maven: com.bitwig:extension-api:18" level="project" />
  </component>
</module>


================================================
FILE: code-formatting.xml
================================================
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<profiles version="23">
    <profile kind="CodeFormatterProfile" name="Bitwig" version="23">
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_ellipsis" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_enum_declarations" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_allocation_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_for_statment" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.new_lines_at_block_boundaries" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_constructor_declaration_parameters" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.insert_new_line_for_parameter" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_package" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_parens_in_enum_constant" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_while" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_parens_in_annotation_type_member_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_javadoc_comments" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.indentation.size" value="3"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_enum_constant_declaration" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_semicolon_in_for" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.align_with_spaces" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.continuation_indentation" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_before_code_block" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_switch_case_expressions" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_after_package" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_multiple_local_declarations" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_enum_constant" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_angle_bracket_in_parameterized_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.indent_root_tags" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_or_operator_multicatch" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.enabling_tag" value="@formatter:on"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.count_line_length_from_starting_position" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_record_components" value="48"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_throws_clause_in_method_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_parameter" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_multiplicative_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_then_statement_on_same_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_explicitconstructorcall_arguments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_prefix_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_brace_in_array_initializer" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_angle_bracket_in_type_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_method" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_parameterized_type_references" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_logical_operator" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_parenthesized_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_annotation_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_record_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_enum_constant" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_multiplicative_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_and_in_type_parameter" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_parens_in_method_invocation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_assignment_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_type_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_for" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.preserve_white_space_between_code_and_line_comments" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_local_variable" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_abstract_method" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_enum_constant_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.align_variable_declarations_on_columns" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_method_invocation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_union_type_in_multicatch" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_at_beginning_of_method_body" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_else_statement_on_same_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_catch_clause" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_parameterized_type_reference" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_array_initializer" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_explicit_constructor_call" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_multiplicative_operator" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_anonymous_type_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_switch_case_expressions" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_shift_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_body_declarations_compare_to_annotation_declaration_header" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_block" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_at_end_of_code_block" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_bitwise_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.put_empty_statement_on_new_line" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_parameters_in_constructor_declaration" value="48"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_type_parameters" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_compact_loops" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.clear_blank_lines_in_block_comment" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_simple_for_body_on_same_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_at_end_of_file_if_missing" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_switch_case_arrow_operator" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_array_initializer" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_unary_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.format_line_comment_starting_on_first_column" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_annotation" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_ellipsis" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_semicolon_in_try_resources" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_colon_in_assert" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_enum_constant" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_and_in_type_parameter" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_parenthesized_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.text_block_indentation" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.align_type_members_on_columns" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_assignment" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_module_statements" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_body_declarations_compare_to_type_header" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_parens_in_method_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.align_tags_names_descriptions" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_enum_constant" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_if_then_body_block_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_first_class_body_declaration" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_before_closing_brace_in_array_initializer" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_constructor_declaration_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.format_guardian_clause_on_one_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_if" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.align_assignment_statements_on_columns" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_permitted_types" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_block_in_case" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_constructor_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_conditional_expression_chain" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_header" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_type_annotations" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_allocation_expression" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_assertion_message_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_switch" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_method_declaration" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.align_fields_grouping_blank_lines" value="2147483647"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.new_lines_at_javadoc_boundaries" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_bitwise_operator" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_annotation_type_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_for" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_resources_in_try" value="80"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_selector_in_method_invocation" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.never_indent_block_comments_on_first_column" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_synchronized" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_allocation_expression" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_source_code" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_array_initializer" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_field" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_at_in_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_method" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_superclass_in_type_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_parenthesized_expression_in_throw" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_not_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_type_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_brace_in_array_initializer" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_parenthesized_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_html" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_at_in_annotation_type_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_method_delcaration" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_compact_if" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_empty_lines" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_type_arguments" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_unary_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_enum_constant" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_annotation" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_enum_declarations" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_package" value="49"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_switchstatements_compare_to_switch" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_before_else_in_if_statement" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_assignment_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_label" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_body_declarations_compare_to_enum_declaration_header" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_conditional" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_method_declaration_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_cast" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_arrow_in_switch_case" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_before_while_in_do_statement" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_bracket_in_array_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_permitted_types_in_type_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_body_declarations_compare_to_record_header" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_angle_bracket_in_parameterized_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_opening_brace_in_array_initializer" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_breaks_compare_to_cases" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_method_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_bitwise_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_try" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_lambda_arrow" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_method_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.indent_tag_description" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_imple_if_on_one_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_record_constructor" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_enum_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_brackets_in_array_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_angle_bracket_in_type_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_string_concatenation" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_semicolon_in_for" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_bracket_in_array_allocation_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_multiple_fields" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_enum_constant_arguments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_prefix_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_array_initializer" value="end_of_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_shift_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_method_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_type_parameters" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_catch" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_shift_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_braces_in_array_initializer" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_multiple_local_declarations" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_simple_do_while_body_on_same_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_annotation_type_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_record_components" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_outer_expressions_when_nested" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_closing_paren_in_cast" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_synchronized" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_annotation_type_member_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_expressions_in_for_loop_header" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_additive_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_simple_getter_setter_on_one_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_while" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_angle_bracket_in_type_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_string_concatenation" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_lambda_arrow" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.join_lines_in_comments" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_record_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_relational_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_multiple_field_declarations" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_between_import_groups" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_at_in_annotation_type_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_logical_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_method_invocation" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_after_imports" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.insert_new_line_before_root_tags" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_record_declaration" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_method_declaration_throws" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_switch_statement" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_postfix_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_for_increments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_type_arguments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_arrow_in_switch_default" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_for_inits" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.disabling_tag" value="@formatter:off"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_enum_constants" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_imports" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_at_end_of_method_body" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_if_while_statement" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_closing_brace_in_block" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_parenthesized_expression_in_return" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_arrow_in_switch_case" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_field" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_between_type_declarations" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_switch_body_block_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_for" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_catch" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_switch" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_anonymous_type_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.never_indent_line_comments_on_first_column" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_for_inits" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_statements_compare_to_block" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_anonymous_type_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_question_in_wildcard" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_method_invocation_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_expressions_in_switch_case_with_arrow" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_switch" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.align_tags_descriptions_grouped" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.line_length" value="110"/>
        <setting id="org.eclipse.jdt.core.formatter.use_on_off_tags" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_method_body_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_brackets_in_array_allocation_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_loop_body_block_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_enum_constant" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_method_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_colon_in_for" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_type_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_closing_angle_bracket_in_type_arguments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_additive_operator" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_multiple_field_declarations" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_record_constructor" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_relational_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_superinterfaces" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_record_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_default" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_question_in_conditional" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_constructor_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_lambda_body" value="end_of_line"/>
        <setting id="org.eclipse.jdt.core.formatter.compact_else_if" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_type_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_catch" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_method_invocation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_method_invocation_arguments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_method_invocation" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_throws_clause_in_constructor_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_before_catch_in_try_statement" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_try" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_parameter" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.clear_blank_lines_in_javadoc_comment" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_relational_operator" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_expressions_in_array_initializer" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_empty_lines_to_preserve" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_colon_in_case" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_additive_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_if" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_type_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_string_concatenation" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_line_comments" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.align_selector_in_method_invocation_on_expression_first_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_record_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_colon_in_labeled_statement" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_switch_case_with_arrow_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_expressions_in_switch_case_with_colon" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_after_code_block" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_superinterfaces_in_type_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_conditional_expression" value="80"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_type" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_type" value="49"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_block" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_local_variable" value="49"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_enum_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_arrow_in_switch_default" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.insert_new_line_between_different_tags" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_additive_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_method_invocation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_while" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.join_wrapped_lines" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_parens_in_constructor_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_field" value="49"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_conditional_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_switchstatements_compare_to_cases" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_bracket_in_array_allocation_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_synchronized" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_shift_operator" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.use_tabs_only_for_leading_indentations" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_try_clause" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_code_block_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_constructor_declaration_throws" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_record_components" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.tabulation.size" value="3"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_bitwise_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_bracket_in_array_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_colon_in_conditional" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_try" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_semicolon_in_try_resources" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.continuation_indentation_for_array_initializer" value="2"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_question_in_wildcard" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_record_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_superinterfaces_in_enum_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_assignment_operator" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_labeled_statement" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_switch" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_superinterfaces" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_method_declaration_parameters" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_closing_angle_bracket_in_type_parameters" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_switch_case_with_arrow" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_lambda_body_block_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_method" value="49"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_parameterized_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_record_constructor_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_record_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_empty_array_initializer_on_one_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_assertion_message" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_constructor_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_new_chunk" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_bracket_in_array_allocation_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_constructor_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_angle_bracket_in_parameterized_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_angle_bracket_in_type_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_assert" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_member_type" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_logical_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_qualified_allocation_expression" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_superinterfaces_in_record_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_if" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_semicolon" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_relational_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_postfix_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_angle_bracket_in_type_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_cast" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_block_comments" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_parameters_in_method_declaration" value="48"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_method_declaration_throws" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_after_last_class_body_declaration" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_statements_compare_to_body" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_simple_while_body_on_same_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_logical_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_between_statement_group_in_switch" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_bracket_in_array_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_annotation" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_enum_constant_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_lambda_declaration" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_case" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_permitted_types" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_bracket_in_array_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_enum_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_method_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_enum_constant" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_type_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_multiplicative_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_package" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_for" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_for_increments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_enum_constant" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_explicitconstructorcall_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_body_declarations_compare_to_enum_constant_header" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_constructor_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_constructor_declaration_throws" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_angle_bracket_in_type_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_question_in_conditional" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.indent_parameter_description" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_at_beginning_of_code_block" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_before_finally_in_try_statement" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.tabulation.char" value="space"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_string_concatenation" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.lineSplit" value="110"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_switch" value="insert"/>
    </profile>
</profiles>



================================================
FILE: gradlew
================================================
#!/bin/sh

#
# Copyright © 2015-2021 the original authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

##############################################################################
#
#   Gradle start up script for POSIX generated by Gradle.
#
#   Important for running:
#
#   (1) You need a POSIX-compliant shell to run this script. If your /bin/sh is
#       noncompliant, but you have some other compliant shell such as ksh or
#       bash, then to run this script, type that shell name before the whole
#       command line, like:
#
#           ksh Gradle
#
#       Busybox and similar reduced shells will NOT work, because this script
#       requires all of these POSIX shell features:
#         * functions;
#         * expansions «$var», «${var}», «${var:-default}», «${var+SET}»,
#           «${var#prefix}», «${var%suffix}», and «$( cmd )»;
#         * compound commands having a testable exit status, especially «case»;
#         * various built-in commands including «command», «set», and «ulimit».
#
#   Important for patching:
#
#   (2) This script targets any POSIX shell, so it avoids extensions provided
#       by Bash, Ksh, etc; in particular arrays are avoided.
#
#       The "traditional" practice of packing multiple parameters into a
#       space-separated string is a well documented source of bugs and security
#       problems, so this is (mostly) avoided, by progressively accumulating
#       options in "$@", and eventually passing that to Java.
#
#       Where the inherited environment variables (DEFAULT_JVM_OPTS, JAVA_OPTS,
#       and GRADLE_OPTS) rely on word-splitting, this is performed explicitly;
#       see the in-line comments for details.
#
#       There are tweaks for specific operating systems such as AIX, CygWin,
#       Darwin, MinGW, and NonStop.
#
#   (3) This script is generated from the Groovy template
#       https://github.com/gradle/gradle/blob/HEAD/subprojects/plugins/src/main/resources/org/gradle/api/internal/plugins/unixStartScript.txt
#       within the Gradle project.
#
#       You can find Gradle at https://github.com/gradle/gradle/.
#
##############################################################################

# Attempt to set APP_HOME

# Resolve links: $0 may be a link
app_path=$0

# Need this for daisy-chained symlinks.
while
    APP_HOME=${app_path%"${app_path##*/}"}  # leaves a trailing /; empty if no leading path
    [ -h "$app_path" ]
do
    ls=$( ls -ld "$app_path" )
    link=${ls#*' -> '}
    case $link in             #(
      /*)   app_path=$link ;; #(
      *)    app_path=$APP_HOME$link ;;
    esac
done

# This is normally unused
# shellcheck disable=SC2034
APP_BASE_NAME=${0##*/}
# Discard cd standard output in case $CDPATH is set (https://github.com/gradle/gradle/issues/25036)
APP_HOME=$( cd "${APP_HOME:-./}" > /dev/null && pwd -P ) || exit

# Use the maximum available, or set MAX_FD != -1 to use that value.
MAX_FD=maximum

warn () {
    echo "$*"
} >&2

die () {
    echo
    echo "$*"
    echo
    exit 1
} >&2

# OS specific support (must be 'true' or 'false').
cygwin=false
msys=false
darwin=false
nonstop=false
case "$( uname )" in                #(
  CYGWIN* )         cygwin=true  ;; #(
  Darwin* )         darwin=true  ;; #(
  MSYS* | MINGW* )  msys=true    ;; #(
  NONSTOP* )        nonstop=true ;;
esac

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar


# Determine the Java command to use to start the JVM.
if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
        # IBM's JDK on AIX uses strange locations for the executables
        JAVACMD=$JAVA_HOME/jre/sh/java
    else
        JAVACMD=$JAVA_HOME/bin/java
    fi
    if [ ! -x "$JAVACMD" ] ; then
        die "ERROR: JAVA_HOME is set to an invalid directory: $JAVA_HOME

Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
    fi
else
    JAVACMD=java
    if ! command -v java >/dev/null 2>&1
    then
        die "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.

Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
    fi
fi

# Increase the maximum file descriptors if we can.
if ! "$cygwin" && ! "$darwin" && ! "$nonstop" ; then
    case $MAX_FD in #(
      max*)
        # In POSIX sh, ulimit -H is undefined. That's why the result is checked to see if it worked.
        # shellcheck disable=SC2039,SC3045
        MAX_FD=$( ulimit -H -n ) ||
            warn "Could not query maximum file descriptor limit"
    esac
    case $MAX_FD in  #(
      '' | soft) :;; #(
      *)
        # In POSIX sh, ulimit -n is undefined. That's why the result is checked to see if it worked.
        # shellcheck disable=SC2039,SC3045
        ulimit -n "$MAX_FD" ||
            warn "Could not set maximum file descriptor limit to $MAX_FD"
    esac
fi

# Collect all arguments for the java command, stacking in reverse order:
#   * args from the command line
#   * the main class name
#   * -classpath
#   * -D...appname settings
#   * --module-path (only if needed)
#   * DEFAULT_JVM_OPTS, JAVA_OPTS, and GRADLE_OPTS environment variables.

# For Cygwin or MSYS, switch paths to Windows format before running java
if "$cygwin" || "$msys" ; then
    APP_HOME=$( cygpath --path --mixed "$APP_HOME" )
    CLASSPATH=$( cygpath --path --mixed "$CLASSPATH" )

    JAVACMD=$( cygpath --unix "$JAVACMD" )

    # Now convert the arguments - kludge to limit ourselves to /bin/sh
    for arg do
        if
            case $arg in                                #(
              -*)   false ;;                            # don't mess with options #(
              /?*)  t=${arg#/} t=/${t%%/*}              # looks like a POSIX filepath
                    [ -e "$t" ] ;;                      #(
              *)    false ;;
            esac
        then
            arg=$( cygpath --path --ignore --mixed "$arg" )
        fi
        # Roll the args list around exactly as many times as the number of
        # args, so each arg winds up back in the position where it started, but
        # possibly modified.
        #
        # NB: a `for` loop captures its iteration list before it begins, so
        # changing the positional parameters here affects neither the number of
        # iterations, nor the values presented in `arg`.
        shift                   # remove old arg
        set -- "$@" "$arg"      # push replacement arg
    done
fi


# Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
DEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'

# Collect all arguments for the java command:
#   * DEFAULT_JVM_OPTS, JAVA_OPTS, JAVA_OPTS, and optsEnvironmentVar are not allowed to contain shell fragments,
#     and any embedded shellness will be escaped.
#   * For example: A user cannot expect ${Hostname} to be expanded, as it is an environment variable and will be
#     treated as '${Hostname}' itself on the command line.

set -- \
        "-Dorg.gradle.appname=$APP_BASE_NAME" \
        -classpath "$CLASSPATH" \
        org.gradle.wrapper.GradleWrapperMain \
        "$@"

# Stop when "xargs" is not available.
if ! command -v xargs >/dev/null 2>&1
then
    die "xargs is not available"
fi

# Use "xargs" to parse quoted args.
#
# With -n1 it outputs one arg per line, with the quotes and backslashes removed.
#
# In Bash we could simply go:
#
#   readarray ARGS < <( xargs -n1 <<<"$var" ) &&
#   set -- "${ARGS[@]}" "$@"
#
# but POSIX shell has neither arrays nor command substitution, so instead we
# post-process each arg (as a line of input to sed) to backslash-escape any
# character that might be a shell metacharacter, then use eval to reverse
# that process (while maintaining the separation between arguments), and wrap
# the whole thing up as a single "set" statement.
#
# This will of course break if any of these variables contains a newline or
# an unmatched quote.
#

eval "set -- $(
        printf '%s\n' "$DEFAULT_JVM_OPTS $JAVA_OPTS $GRADLE_OPTS" |
        xargs -n1 |
        sed ' s~[^-[:alnum:]+,./:=@_]~\\&~g; ' |
        tr '\n' ' '
    )" '"$@"'

exec "$JAVACMD" "$@"



================================================
FILE: gradlew.bat
================================================
@rem
@rem Copyright 2015 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem

@if "%DEBUG%"=="" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
@rem This is normally unused
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@rem Resolve any "." and ".." in APP_HOME to make it shorter.
for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@rem Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m"

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH. 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME% 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\gradle\wrapper\gradle-wrapper.jar


@rem Execute Gradle
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*

:end
@rem End local scope for the variables with windows NT shell
if %ERRORLEVEL% equ 0 goto mainEnd

:fail
rem Set variable GRADLE_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
set EXIT_CODE=%ERRORLEVEL%
if %EXIT_CODE% equ 0 set EXIT_CODE=1
if not ""=="%GRADLE_EXIT_CONSOLE%" exit %EXIT_CODE%
exit /b %EXIT_CODE%

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega



================================================
FILE: LICENSE
================================================
MIT License

Copyright (c) 2019 Bitwig GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



================================================
FILE: pom.xml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.bitwig.extensions</groupId>
    <artifactId>bitwig-extensions</artifactId>
    <packaging>jar</packaging>
    <name>Bitwig Studio Extensions (Github)</name>
    <version>1-SNAPSHOT</version>

    <repositories>
        <repository>
            <id>bitwig</id>
            <name>Bitwig Maven Repository</name>
            <url>https://maven.bitwig.com</url>
        </repository>
    </repositories>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.5.1</version>
                <configuration>
                    <optimize>true</optimize>
                    <fork>true</fork>
                    <source>21</source>
                    <target>21</target>
                    <encoding>UTF-8</encoding>
                    <maxmem>1024m</maxmem>
                </configuration>
            </plugin>

            <plugin>
                <groupId>com.coderplus.maven.plugins</groupId>
                <artifactId>copy-rename-maven-plugin</artifactId>
                <version>1.0</version>
                <executions>
                    <execution>
                        <id>rename-file</id>
                        <phase>install</phase>
                        <goals>
                            <goal>copy</goal>
                        </goals>
                        <configuration>
                            <sourceFile>${project.build.directory}/${project.build.finalName}.jar</sourceFile>
                            <destinationFile>${project.build.directory}/Bitwig.bwextension</destinationFile>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <profiles>
        <profile>
            <id>use-local-bitwig-extension-api</id>
            <activation>
                <file>
                    <exists>../is-building-bitwig.txt</exists>
                </file>
            </activation>
            <dependencies>
                <dependency>
                    <groupId>com.bitwig</groupId>
                    <artifactId>base-extensions-api</artifactId>
                    <version>LOCAL</version>
                </dependency>
            </dependencies>
        </profile>
        <profile>
            <id>use-published-extension-api</id>
            <activation>
                <file>
                    <missing>../is-building-bitwig.txt</missing>
                </file>
            </activation>
            <dependencies>
                <dependency>
                    <groupId>com.bitwig</groupId>
                    <artifactId>extension-api</artifactId>
                    <version>[18,)</version>
                </dependency>
            </dependencies>
        </profile>
    </profiles>
</project>



================================================
FILE: .editorconfig
================================================
# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true

# Matches multiple files with brace expansion notation
[**.java]
charset = utf-8
indent_style = space
indent_size = 3
trim_trailing_whitespace = true



================================================
FILE: doc-source/Akai/Advance Keyboards.md
================================================
# AKAI Advance Keyboards

* The 8 knobs are mapped to the selected device's remote controls
* Pads, Keys, Mod-Wheel and Pitch-Bend are working
* The transport controls, and the other buttons are not



================================================
FILE: doc-source/Akai/MPK mini mk3.md
================================================
# AKAI MPK mini MK3

## Overview

This controller extension adds support for the MPK mini MK3:
 - Keys provide note input (also with a dedicated note input port)
 - Pads provide note input (also with a dedicated note input port)
 - Knobs are mapped to the selected device's remote controls, with the targeted control name shown on the screen

## Device Setup

There is no configuration required on the device; Bitwig Studio will send a custom "program" to it.

 - Do not use "PROG SELECT"; it will interfere with Bitwig Studio's connection.
 - To synchronize the MPK's arpeggiator and note repeat: go into Bitwig's Synchronization settings (Dashboard > Settings > Synchronization), and enabling sending MIDI "Clock," "Start/Stop," and "SPP" to the MPK mini MK3.



================================================
FILE: doc-source/Arturia/MicroLab.md
================================================
# Arturia MicroLab

## About this controller

This is a portable keyboard made by Arturia.
It has some additional integration with Analog Labs.

See https://www.arturia.com

## Preset navigation with Analog Lab

Start by loading Arturia Analog Lab VST3 or VST2 instrument plugin.

*Shift + Oct-/+*: loads previous/next preset

*Shift + Pitchstrip*: browse filter and categories, tap to (de)activate

*Shift + Modstrip*: browse presets, tap to select



================================================
FILE: doc-source/Devine/EZ-Creator Fade.md
================================================
# Device EZ-Creator Fade

## Transport

The transport buttons are working.

## Channel controls

Each column contains a knob which controls the track's pan.
Then comes a vertical fader which controls the track's volume.
And finally a button which toggles the track's mute.

The first 8 columns control the 8 tracks of the track bank. You can move the track bank by using the two buttons on the right of the four leds on the bottom.

The last column control the master track.

## AB Crossfade

The horizontal crossfade controls the AB crossfade.



================================================
FILE: doc-source/Devine/EZ-Creator Key.md
================================================
# Devine EZ-Creator Key

Keys are working as expected.

The knob is controlling the first remote control of the selected device.

The pitch up and down button do nothing.



================================================
FILE: doc-source/Devine/EZ-Creator Pads.md
================================================
# Define EZ-Creator Pads

## Pads

The pads are working and mapped in order to play well with the first 12 pads of Bitwig Studio's drum machine.

## Transport

The transport buttons are working as expected.

## Fader

The fader controls the first remote control of the selected device.

## Bank button

This button does nothing.

## 2 Buttons next to the Bank leds

They select the previous or next track.



================================================
FILE: doc-source/Devine/EZ-Creator Plus.md
================================================
# Devine EZ-Creator Plus

## Pads

The pads are working and mapped to work well with the Bitwig Drum Machine.

## Keys

The keys are working.

## Knobs

They control the 1-4 remote controls of the selected device.

## Faders

They control the 5-8 remote controls of the selected device.



================================================
FILE: doc-source/Devine/VersaKey 25.md
================================================
# Devine VersaKey 25

## Pads

The pads are working and mapped to work well with the Bitwig Drum Machine.

## Keys

The keys are working.

## Knobs

They control the 1-4 remote controls of the selected device.

## Transport

The transport controls are working as indicated on the buttons.



================================================
FILE: doc-source/Devine/VersaKey 49.md
================================================
# Devine VersaKey 49

## Pads

The pads are working and mapped to work well with the Bitwig Drum Machine.

## Keys

The keys are working.

## Knobs

They control the 1-8 remote controls of the selected device.

## Transport

The transport controls are working as indicated on the buttons.



================================================
FILE: doc-source/Devine/VersaKey 61.md
================================================
# Devine VersaKey 61

## Pads

The pads are working and mapped to work well with the Bitwig Drum Machine.

## Keys

The keys are working.

## Knobs

They control the 1-8 remote controls of the selected device.

## Transport

The transport controls are working as indicated on the buttons.



================================================
FILE: doc-source/Devine/VersaKey 88.md
================================================
# Devine VersaKey 88

## Pads

The pads are working and mapped to work well with the Bitwig Drum Machine.

## Keys

The keys are working.

## Knobs

They control the 1-8 remote controls of the selected device.

## Transport

The transport controls are working as indicated on the buttons.



================================================
FILE: doc-source/Generic/E-Drum.md
================================================
# Generic E-Drum

* A simple generic MIDI E-Drum controller extension which creates a MIDI note input
* Supports generic transport control (via sysex)



================================================
FILE: doc-source/Kenton/KillaMixMini.md
================================================
# Kenton KillaMix Mini

## Introduction

This extension offers two modes to control Bitwig Studio. The first one is a simple mixer mode, the other one is for device control.
You can switch between the two modes with button 9.

Before you can use this extension, you will have to set the Kenton KillaMix up, see section _Setup_.

## Device Mode
      
This mode allows you to navigte tracks, devices and device-pages in Bitwig Studio. Knobs 1-8 control the currently
selected device/page macros. Knob 9 always adjusts the volume of the current track. The buttons 1-6 allow you to navigate in the following way:
* Buttons 1 & 2: select previous/next track
* Buttons 3 & 4: select previous/next device
* Buttons 5 & 6: select previous/next device-page     

The button light indicates if the previous/next step for navigation is available. The joystick is freely mappable. In the Studio I/O panel on the right
side of the Bitwig Studio window, you can select between displaying the parameter with or without applied modulations on the encoder ring.

## Mixer Mode
In this mode the knobs control the track volumes of 8 consecutive tracks. Use the joystick left/right to navigate the tracks. The buttons toggle
between mute/unmute for the respective tracks. Knob 9 controls the master volume.

## Setup
In order for this integration to work, the Kenton KillaMix controller needs to be setup in a way that allows
Bitwig to communicate back controller values. This is achieved in the following way:</p>
* Enable relative knob updates: while plugging in the USB cable, press <b>buttons</b> 6 and 8. Hold this for several seconds, then release the buttons. Button 9 (and potentially others) will illuminate to indicate that the configuation mode has been entered. Press <b>button</b> 1 several times until the <b>encoder ring</b> above it shows two illuminated segments ( Ableton signed 7 bit mode ). Proceed with the next step.
* Enable CC updates: Press <b>button</b> 3 until the <b>encoder ring</b> above it shows one lit LED (receive CC mode). Press <b>button</b> 9 to save and exit this configuration mode.
* Enable button toggle behavior: while the controller is on, press and hold <b>knob</b> 9 while pressing <b>knob</b> 8. Release both knobs, all encoder rings will light up to show that the button configuration mode has been entered. Press each <b>button</b> several times until it starts flashing. Do this for all buttons. To exit this configuration mode, press any <b>knob</b>. 



================================================
FILE: doc-source/MIDIPLUS/Xmini Keyboards.md
================================================
# MIDIPlus Xmini Keyboards

* The four knobs controls the first four remote controls of the selected device
* Keys, Pitch-Bend and Mod-Wheel are working
* Transport buttons are working

Make sure your controller has the latest firmware update.



================================================
FILE: doc-source/MIDIPLUS/XPro Keyboards.md
================================================
# MIDIPlus XPro Keyboards

* The eight knobs controls the remote controls of the selected device
* Pads are working and will be mapped to the first 8 pads of the Bitwig Studio drum machine
* Keys, Pitch-Bend and Mod-Wheel are working
* Transport buttons are working

Make sure your controller has the latest firmware update.



================================================
FILE: doc-source/Novation/Launch Control XL.md
================================================
# Launch Control XL

This controller extension only works with the factory templates; user templates are ignored because they're not predictable.

To switch between factory templates, press the Factory button (top right) and the bottom row of buttons becomes green.
Select one of the factory templates between 1 and 5.

## Volume faders

The eight volume faders always control the **track volume**. You can scroll the track bank using the track select arrows.

## Track focus

The track focus buttons always **selects** the track.

## Track control / Device Bank

This is a multi-function row of buttons.

You can configure their function by pushing one of the **Mute**, **Solo**, **Record Arm** or **Device** button on the right.
In case of device, it lets you select the *remote controls page* for the selected device.

# Templates

## Factory template 1: Two sends and device mode

The *first* and *second* knobs rows control the **sends**. You can *scroll* the *send window* using the send select buttons.
The *third* knob row controls the **remote controls** of the currently *selected device*.

## Factory template 2: Two sends and device mode

The *first* and *second* knobs rows control the **sends**. You can *scroll* the *send window* using the send select buttons.
The *third* knob row controls the first **remote controls** of track's device.

## Factory template 3: Two sends and project remotes

Same as above except that the *third* row controls the **project's remotes**.

## Factory template 4: Three sends mode

Same as above except that the *third* row is an additional **send** control.

## Factory template 5: One send and Two channel device controls mode

The *first* row of knobs controls the **send**.
The *second* and *third* rows of knobs controls the two first **remote controls** of each track's *selected device*.

## Factory template 6: Three channel device controls mode

The *first*, *second* and *third* rows of knobs controls the three first **remote controls** of each track's *selected device*.

## Factory template 7: Three track remote controls mode

The *first*, *second* and *third* rows of knobs controls the three first **remote controls** of each track.



================================================
FILE: doc-source/Novation/Launchkey Mini.md
================================================
# Launchkey Mini

## Modes

This controller extension offers 3 modes: PLAY, LAUNCH and DRUM

Cycle through modes with the > (INCONTROL) button.

### PLAY mode

In this mode the 8 knobs are mapped to remote controls.

The upper 8 drum-pads are used to select remote control parameter pages.

The lower 8 drum-pads are used to select the device within the device chain.

Track ◂▸ changes the selected track.

__Browser__

The popup browser can be opened by:
* pressing one of the round ▹ buttons (replacing)
* Selecting an empty device (inserts at the end of the chain)

▴ Select previous item

▾ Select next item

▹ (Red) Cancel

▹ (Green) Commit


### LAUNCH mode

In this mode the drum-pads launches clips on a 8 track x 2 scene window

Track ◂▸ and scene ▴▾ buttons are used or navigation and the round ▹ buttons are used to launch the entire scene.

In this mode the 8 knobs are freely mappable independently from the PLAY mode.

### DRUM mode

In this mode the drum-pads act as actual drum pads.

The 8 knobs are borrowed from the LAUNCH mode and the browser can be used as in the PLAY mode.


================================================
FILE: doc-source/Novation/Launchkey MK2.md
================================================
# Launchkey MK2

## Modes

This controller extension offers 3 modes: PLAY, LAUNCH and DRUM

Select modes with the 3 INCONTROL buttons.

### PLAY mode

In this mode the 8 knobs are mapped to remote controls.

The upper 8 drum-pads are used to select remote control parameter pages.

The lower 8 drum-pads are used to select the device within the device chain.

The 9 sliders are mapped to envelope or drawbars.

Track ◂▸ changes the selected track.

__Browser__

The popup browser can be opened by:
* pressing one of the round ▹ buttons (replacing)
* Selecting an empty device (inserts at the end of the chain)

▴ Select previous item

▾ Select next item

▹ (Red) Cancel

▹ (Green) Commit


### LAUNCH mode

In this mode the drum-pads launches clips on a 8 track x 2 scene window

Track ◂▸ and scene ▴▾ buttons are used or navigation and the round ▹ buttons are used to launch the entire scene.

In this mode the 8 knobs are freely mappable independently from the PLAY mode.

Sliders 1-9 are mapped to track volume (9 - master track)

### DRUM mode

In this mode the drum-pads act as actual drum pads.

The 8 knobs are mapped to the remote controls of the drum instrument.

Sliders 1-9 are mapped to track volume (9 - master track) 

The browser can be used as in the PLAY mode.


## Buttons 1-9 ##

Button 1-8 toggles either mute or solo of the 8 active tracks, depending on the state of button 9. 


================================================
FILE: doc-source/Novation/LaunchPad Pro.md
================================================
# LaunchPad PRO

## Overview

This controller extension brings the following features to the controller:
 - Clip launcher via session mode
 - Keyboard and Drum play
    - Selection of modes and root key
 - Drum sequencer
 - Step sequencer
 - Basic mixer controls
    - Arm/Solo/Mute and Track select
    - Volume/Pan/Sends control

## Device Setup

You should configure your launchpad as follow:
 - Press the setup button
 - Choose the programmer mode
 - Select Polyphonic after touch

## Global Functions

|Function|How|
|---|---|
|Toggle Metronome|Press **Click**|
|Tap Tempo|Hold **Shift** and tap **Click**|
|Stop all clips|Hold **Shift** and press **Stop Clip**|
|Toggle Play|Press **Double**|
|Toggle Arranger Record|Hold **Shift** and press **Double**|
|Duplicate|Press **Duplicate**|
|Undo|Press **Undo**|
|Redo|Press **Redo**|

## Session Mode

To activate the session mode, press **Session**.
Then you'll see the clips on the pads and the scenes launchers on the right.
Note that if you change the color of a scene, it will update the scene launcher button accordingly.

|Function|Shortcut|
|---|---|
|Launch a clip|Press the pad|
|Launch a scene|Press the scene button (on the right)|
|Stop a clip|Press **Stop Clip** and choose the track to stop in the bottom row|
|Stop all clips|Hold **Shift** and press **Stop Clip**|
|Move the clip launcher window|Use the arrows on top left, hold **Shift** to scroll by page|
|Select a clip|hold **Shift** and press the pad|
|Delete a clip|hold **Delete** and press the pad|
|Quantize a clip|hold **Quantize** and press the pad|

## Play Mode

Activate the *Play Mode* by pressing the **Note** button.

The *Play Mode* lets you play notes via a few different layouts.
You can select the different layouts by pressing a scene buttons.

|Index|Layout Name|
|---|---|
|1|Guitar|
|2|Line/3|
|3|Line/7|
|4|Piano|
|5|64 Drums|
|6|*Unused*|
|7|*Unused*|
|8|Root Key and Mode chooser|

## Drum Sequencer Mode

Activate the Drum Sequencer Mode by pressing the **Device** button.

The *Drum Sequencer* needs a clip to be selected first.

The grid is divided in two parts, the 32 upper pads are for the steps, while the 32 others are for drums, performances and data.

### Steps

The 32 upper pads displays 32 steps. The light will be bright if there is a note on at this steps, dimmed if there is a sustained note or off if there is nothing.

The four scenes on the right lets you edit up to 8 bars, each scene buttons will display 2 bars: [1,2], [3,4], [5,6], [7,8].

To set the length of the clip, you can hold **Shift** and press one of the 8 scene buttons, or a step.

### Minor Modes

To select a minor mode, press one of the four scene buttons on the bottom right.
There are four minor modes:

|Index|Description|
|---|---|
|1|Play drums, note repeat, clip operations, select/solo/mute of a pad|
|2|Play drums, performance macros and scene macros|
|3|Edit Velocity, Note Length and Pan **per step**|
|3|Edit Micro Tuning, Timbre and Pressure **per step**|

#### 1. Play drums and basic actions

On the bottom left you'll see a 4x4 grid of pads which you can play.
Playing a pad will select the given drum pad in the sequencer above.
You can select a pad without playing it by pressing **Shift** + **Pad**.

On the bottom right, there will be a bunch of *action* pads. They work by holding them, and then pressing a pad.
You'll have a various different note repeat speed at the top and *Drum Pad Select*, *Mute* and *Solo* at the bottom.
You can un-mute all drum pads by doing **Delete** + **Mute Pad**.
You can un-solo all drum pads by doing **Delete** + **Solo Pad**.

#### 2. Drum Performances and Scenes

To use this minor mode, add two remote control pages to your drum kit:
 - One page with 8 Knobs, and add the tag *drum-perfs*
 - One page with 8 buttons, and add the tag *drum-scenes*

## Step Sequencer Mode

Activate the *Step Sequencer Mode* by pressing the **User** button.

This mode is very similar to the *Drum Sequencer Mode* except that it is intended to sequence notes.
To enter a step, hold the steps and press the pitches. 

## Volume Mode

Activate the *Volume Mode* by pressing the **Volume** button.

## Pan Mode

Activate the *Pan Mode* by pressing the **Pan** button.

## Sends Mode

Activate the *Sends Mode* by pressing the **Sends** button.



================================================
FILE: doc-source/Vault/Apex.md
================================================
# Vault Apex 25, 49 and 61

## Transport

Transport buttons are working.

## Keys

There is a dedicated input "Apex Keys" with the key events, mod-wheel and pitch bend.

## Pads

There is a dedicated input "Apex Pads" with the pad events.

## Knobs

The knobs are mapped to the remote controls of the selected device.

## Faders

The faders control the track volume. The last fader controls the master track volume.



================================================
FILE: gradle/wrapper/gradle-wrapper.properties
================================================
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.6-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/advance/AdvanceControllerExtension.java
================================================
package com.bitwig.extensions.controllers.akai.advance;

import com.bitwig.extension.controller.ControllerExtension;
import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.CursorRemoteControlsPage;
import com.bitwig.extension.controller.api.CursorTrack;
import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extension.controller.api.MidiOut;
import com.bitwig.extension.controller.api.NoteInput;
import com.bitwig.extension.controller.api.PinnableCursorDevice;
import com.bitwig.extension.controller.api.RemoteControl;

public class AdvanceControllerExtension extends ControllerExtension
{
   public AdvanceControllerExtension(
      final AdvanceControllerExtensionDefinition definition, final ControllerHost host)
   {
      super(definition, host);
   }

   @Override
   public void init()
   {
      final ControllerHost host = getHost();

      mMidiIn = host.getMidiInPort(0);
      mMidiIn.setMidiCallback(this::onMiniIn);
      mMidiIn.setSysexCallback(this::onSysexIn);

      mKeyboardInput = mMidiIn.createNoteInput("Keyboard", "80????", "90????", "B001??", "B00B??", "B040??", "D0????", "E0????");
      mKeyboardInput.setShouldConsumeEvents(true);

      mPadInput = mMidiIn.createNoteInput("Pads", "89????", "99????", "B901??", "B90B??", "B940??", "D9????", "E9????");
      mPadInput.setShouldConsumeEvents(true);

      mMidiOut = host.getMidiOutPort(0);

      mCursorTrack = host.createCursorTrack("0", "Akai Advance", 0, 0, true);
      mCursorDevice = mCursorTrack.createCursorDevice();
      mRemoteControls = mCursorDevice.createCursorRemoteControlsPage(8);
      for (int i = 0; i < 8; ++i)
      {
         final RemoteControl parameter = mRemoteControls.getParameter(i);
         parameter.setIndication(true);
      }
   }

   @Override
   public void exit()
   {

   }

   @Override
   public void flush()
   {

   }

   private void onMiniIn(final int status, final int data1, final int data2)
   {
      int channel = status & 0xF;
      int msg = status >> 4;

      //getHost().println("MIDI IN, msg: " + msg + " channel: " + channel + ", data1: " + data1 + ", data2: " + data2);

      switch (msg)
      {
         case 11:
         {
            if (50 <= data1 && data1 < 58)
            {
               int index = data1 - 50;
               int inc = data2 < 64 ? data2 : (data2 - 128);
               double scaledInc = inc / 128.0f;
               mRemoteControls.getParameter(index).inc(scaledInc);
            }
         }
      }
   }

   private void onSysexIn(final String sysex)
   {
      getHost().println("got sysex: " + sysex);
   }

   private MidiIn mMidiIn;
   private MidiOut mMidiOut;
   private NoteInput mKeyboardInput;
   private NoteInput mPadInput;
   private CursorTrack mCursorTrack;
   private PinnableCursorDevice mCursorDevice;
   private CursorRemoteControlsPage mRemoteControls;
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/advance/AdvanceControllerExtensionDefinition.java
================================================
package com.bitwig.extensions.controllers.akai.advance;

import java.util.UUID;

import com.bitwig.extension.api.PlatformType;
import com.bitwig.extension.controller.AutoDetectionMidiPortNamesList;
import com.bitwig.extension.controller.ControllerExtension;
import com.bitwig.extension.controller.ControllerExtensionDefinition;
import com.bitwig.extension.controller.api.ControllerHost;

public class AdvanceControllerExtensionDefinition extends ControllerExtensionDefinition
{
   private final static UUID ID = UUID.fromString("fbfd5fd9-1e34-4a38-9306-12e4f83fb8a8");

   @Override
   public String getHardwareVendor()
   {
      return "Akai";
   }

   @Override
   public String getHardwareModel()
   {
      return "ADVANCE 25/49/61";
   }

   @Override
   public int getNumMidiInPorts()
   {
      return 1;
   }

   @Override
   public int getNumMidiOutPorts()
   {
      return 1;
   }

   @Override
   public void listAutoDetectionMidiPortNames(
      final AutoDetectionMidiPortNamesList list, final PlatformType platformType)
   {
      switch (platformType)
      {
         case LINUX:
            list.add(new String[]{"ADVANCE25 MIDI 1"}, new String[]{"ADVANCE25 MIDI 1"});
            list.add(new String[]{"ADVANCE49 MIDI 1"}, new String[]{"ADVANCE49 MIDI 1"});
            list.add(new String[]{"ADVANCE61 MIDI 1"}, new String[]{"ADVANCE61 MIDI 1"});
            break;

         case WINDOWS:
            list.add(new String[]{"ADVANCE25"}, new String[]{"ADVANCE25"});
            list.add(new String[]{"ADVANCE49"}, new String[]{"ADVANCE49"});
            list.add(new String[]{"ADVANCE61"}, new String[]{"ADVANCE61"});
            break;

         case MAC:
            list.add(new String[]{"ADVANCE25 Port 1"}, new String[]{"ADVANCE25 Port 1"});
            list.add(new String[]{"ADVANCE49 Port 1"}, new String[]{"ADVANCE49 Port 1"});
            list.add(new String[]{"ADVANCE61 Port 1"}, new String[]{"ADVANCE61 Port 1"});
            break;
      }
   }

   @Override
   public ControllerExtension createInstance(final ControllerHost host)
   {
      return new AdvanceControllerExtension(this, host);
   }

   @Override
   public String getName()
   {
      return getHardwareModel();
   }

   @Override
   public String getAuthor()
   {
      return "Bitwig";
   }

   @Override
   public String getVersion()
   {
      return "1.0";
   }

   @Override
   public UUID getId()
   {
      return ID;
   }

   @Override
   public int getRequiredAPIVersion()
   {
      return 3;
   }

   public static AdvanceControllerExtensionDefinition getInstance()
   {
      return mInstance;
   }

   @Override
   public String getHelpFilePath()
   {
      return "Controllers/Akai/Advance Keyboards.html";
   }

   private static AdvanceControllerExtensionDefinition mInstance = new AdvanceControllerExtensionDefinition();
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/AbstractSessionLayer.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common;

import com.bitwig.extension.controller.api.ClipLauncherSlot;
import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extension.controller.api.Track;
import com.bitwig.extension.controller.api.TrackBank;
import com.bitwig.extensions.controllers.akai.apc.common.led.LedBehavior;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.novation.commonsmk3.ColorLookup;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;

public abstract class AbstractSessionLayer extends Layer {
    protected final int[][] colorIndex = new int[8][8];
    protected SettableBooleanValue clipLauncherOverdub;

    public AbstractSessionLayer(final Layers layers) {
        super(layers, "SESSION_LAYER");
    }

    protected abstract boolean isPlaying();

    protected abstract boolean isShiftHeld();

    protected RgbLightState getState(final Track track, final ClipLauncherSlot slot, final int trackIndex,
                                     final int sceneIndex) {
        if (slot.hasContent().get()) {
            final int color = colorIndex[sceneIndex][trackIndex];
            if (slot.isSelected().get() && isShiftHeld()) {
                return RgbLightState.WHITE_BRIGHT;
            }
            if (slot.isRecordingQueued().get()) {
                return RgbLightState.RED.behavior(LedBehavior.BLINK_4);
            } else if (slot.isRecording().get()) {
                return RgbLightState.RED.behavior(LedBehavior.PULSE_2);
            } else if (slot.isPlaybackQueued().get()) {
                return RgbLightState.of(color, LedBehavior.BLINK_4);
            } else if (slot.isStopQueued().get()) {
                return RgbLightState.GREEN_PLAY.behavior(LedBehavior.BLINK_8);
            } else if (slot.isPlaying().get() && track.isQueuedForStop().get()) {
                return RgbLightState.GREEN.behavior(LedBehavior.BLINK_8);
            } else if (slot.isPlaying().get()) {
                if (clipLauncherOverdub.get() && track.arm().get()) {
                    return RgbLightState.RED.behavior(LedBehavior.PULSE_2);
                } else {
                    if (isPlaying()) {
                        return RgbLightState.GREEN_PLAY;
                    }
                    return RgbLightState.GREEN;
                }
            }
            return RgbLightState.of(color);
        }
        if (slot.isSelected().get() && isShiftHeld()) {
            return RgbLightState.WHITE_DIM;
        }
        if (slot.isRecordingQueued().get()) {
            return RgbLightState.RED.behavior(LedBehavior.BLINK_8); // Possibly Track Color
        } else if (track.arm().get()) {
            return RgbLightState.RED.behavior(LedBehavior.LIGHT_25);
        }
        return RgbLightState.OFF;
    } // V ultra_X_39--

    protected void markTrackBank(TrackBank bank) {
        bank.canScrollBackwards().markInterested();
        bank.canScrollForwards().markInterested();
        bank.sceneBank().canScrollBackwards().markInterested();
        bank.sceneBank().canScrollForwards().markInterested();
    }

    protected void markTrack(final Track track) {
        track.isStopped().markInterested();
        track.mute().markInterested();
        track.solo().markInterested();
        track.isQueuedForStop().markInterested();
        track.arm().markInterested();
    }

    protected void prepareSlot(final ClipLauncherSlot slot, final int sceneIndex, final int trackIndex) {
        slot.hasContent().markInterested();
        slot.isPlaying().markInterested();
        slot.isStopQueued().markInterested();
        slot.isRecordingQueued().markInterested();
        slot.isRecording().markInterested();
        slot.isPlaybackQueued().markInterested();
        slot.isSelected().markInterested();
        slot.color().addValueObserver((r, g, b) -> colorIndex[sceneIndex][trackIndex] = ColorLookup.toColor(r, g, b));
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/MidiProcessor.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common;

import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extension.controller.api.NoteInput;
import com.bitwig.extensions.framework.time.TimedEvent;

import java.util.function.IntConsumer;

public interface MidiProcessor {

    NoteInput createNoteInput(String name, String... mask);

    void sendMidi(final int status, final int val1, final int val2);

    void start();

    void queueEvent(TimedEvent currentTimer);

    void setModeChangeListener(final IntConsumer modeChangeListener);

    MidiIn getMidiIn();

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/OrientationFollowType.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common;

import java.util.Arrays;

public enum OrientationFollowType {
    AUTOMATIC("Automatic", "Auto"), //
    FIXED_VERTICAL("Mix Panel Layout", "Mixer"), //
    FIXED_HORIZONTAL("Arrange Panel Layout", "Arrange");

    private final String label;
    private final String shortLabel;

    OrientationFollowType(final String label, final String shortLabel) {
        this.label = label;
        this.shortLabel = shortLabel;
    }

    public String getLabel() {
        return label;
    }

    public String getShortLabel() {
        return shortLabel;
    }

    public static OrientationFollowType toType(final String value) {
        return Arrays.stream(OrientationFollowType.values())
                .filter(type -> type.label.equals(value))
                .findFirst()
                .orElse(OrientationFollowType.FIXED_VERTICAL);
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/PanelLayout.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common;

public enum PanelLayout {
   VERTICAL,
   HORIZONTAL
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/ApcButton.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.time.TimeRepeatEvent;
import com.bitwig.extensions.framework.time.TimedDelayEvent;
import com.bitwig.extensions.framework.time.TimedEvent;

import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

public abstract class ApcButton {
    public static final int STD_REPEAT_DELAY = 400;
    public static final int STD_REPEAT_FREQUENCY = 50;

    protected MultiStateHardwareLight light;
    protected HardwareButton hwButton;
    protected MidiProcessor midiProcessor;
    private TimedEvent currentTimer;
    private long recordedDownTime;
    protected final int midiId;

    protected ApcButton(final int channel, final int midiId, final String name, final HardwareSurface surface,
                        final MidiProcessor midiProcessor) {
        this.midiProcessor = midiProcessor;
        final MidiIn midiIn = midiProcessor.getMidiIn();
        this.midiId = midiId;
        hwButton = surface.createHardwareButton(name + "_" + midiId);
        hwButton.pressedAction().setPressureActionMatcher(midiIn.createNoteOnVelocityValueMatcher(channel, midiId));
        hwButton.releasedAction().setActionMatcher(midiIn.createNoteOffActionMatcher(channel, midiId));
        light = surface.createMultiStateHardwareLight(name + "_LIGHT_" + midiId);
        light.state().setValue(RgbLightState.OFF);
        hwButton.setBackgroundLight(light);
        hwButton.isPressed().markInterested();
    }


    public void refresh() {
        light.state().setValue(null);
    }

    public void bindIsPressed(final Layer layer, final Consumer<Boolean> handler) {
        layer.bind(hwButton, hwButton.pressedAction(), () -> handler.accept(true));
        layer.bind(hwButton, hwButton.releasedAction(), () -> handler.accept(false));
    }

    public void bindPressed(final Layer layer, final Runnable action) {
        layer.bind(hwButton, hwButton.pressedAction(), action);
    }

    public void bindPressed(final Layer layer, final HardwareActionBindable action) {
        layer.bind(hwButton, hwButton.pressedAction(), action);
    }

    public void bindRelease(final Layer layer, final Runnable action) {
        layer.bind(hwButton, hwButton.releasedAction(), action);
    }

    public void bindLight(final Layer layer, final Supplier<InternalHardwareLightState> supplier) {
        layer.bindLightState(supplier, light);
    }

    public void bindLightPressed(final Layer layer, final Function<Boolean, InternalHardwareLightState> supplier) {
        layer.bindLightState(() -> supplier.apply(hwButton.isPressed().get()), light);
    }

    public void bindLight(final Layer layer, final Function<Boolean, InternalHardwareLightState> pressedCombine) {
        layer.bindLightState(() -> pressedCombine.apply(hwButton.isPressed().get()), light);
    }

    public void bindLightPressed(final Layer layer, final InternalHardwareLightState state,
                                 final InternalHardwareLightState holdState) {
        layer.bindLightState(() -> hwButton.isPressed().get() ? holdState : state, light);
    }

    /**
     * Models following behavior. Pressing and Releasing the button within the given delay time executes the click event.
     * Long Pressing the button invokes the holdAction with true and then the same action with false once released.
     *
     * @param layer       the layer
     * @param clickAction the action invoked if the button is pressed and release in less than the given delay time
     * @param holdAction  action called with true when the delay time expires and with false if released under this condition
     * @param delayTime   the delay time
     */
    public void bindDelayedHold(final Layer layer, final Runnable clickAction, final Consumer<Boolean> holdAction,
                                final long delayTime) {
        layer.bind(hwButton, hwButton.pressedAction(), () -> initiateHold(holdAction, delayTime));
        layer.bind(hwButton, hwButton.releasedAction(), () -> handleDelayedRelease(clickAction, holdAction));
    }

    private void initiateHold(final Consumer<Boolean> holdAction, final long delayTime) {
        recordedDownTime = System.currentTimeMillis();
        currentTimer = new TimedDelayEvent(() -> {
            holdAction.accept(true);
        }, delayTime);
        midiProcessor.queueEvent(currentTimer);
    }

    private void handleDelayedRelease(final Runnable clickAction, final Consumer<Boolean> holdAction) {
        if (currentTimer != null && !currentTimer.isCompleted()) {
            currentTimer.cancel();
            clickAction.run();
            currentTimer = null;
        } else {
            holdAction.accept(false);
        }
    }

    /**
     * Binds the given action to a button. Upon pressing the button the action is immediately executed. However while
     * holding the button, the action repeats after an initial delay. The standard delay time of 400ms and repeat
     * frequency of 50ms are used.
     *
     * @param layer  the layer this is bound to
     * @param action action to be invoked and after a delay repeat
     */
    public void bindRepeatHold(final Layer layer, final Runnable action) {
        layer.bind(hwButton, hwButton.pressedAction(),
                () -> initiateRepeat(action, STD_REPEAT_DELAY, STD_REPEAT_FREQUENCY));
        layer.bind(hwButton, hwButton.releasedAction(), this::cancelEvent);
    }

    public void initiateRepeat(final Runnable action, final int repeatDelay, final int repeatFrequency) {
        action.run();
        currentTimer = new TimeRepeatEvent(action, repeatDelay, repeatFrequency);
        midiProcessor.queueEvent(currentTimer);
    }

    private void cancelEvent() {
        if (currentTimer != null) {
            currentTimer.cancel();
            currentTimer = null;
        }
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/ClickEncoder.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import java.util.function.IntConsumer;

import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.HardwareActionBindable;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extension.controller.api.Parameter;
import com.bitwig.extension.controller.api.RelativeHardwareKnob;
import com.bitwig.extension.controller.api.RelativeHardwareValueMatcher;
import com.bitwig.extension.controller.api.SettableRangedValue;
import com.bitwig.extensions.framework.Layer;

public class ClickEncoder {
    private final RelativeHardwareKnob encoder;
    private final ControllerHost host;
    
    public ClickEncoder(int ccNr, final ControllerHost host, final HardwareSurface surface, MidiIn midiIn) {
        encoder = surface.createRelativeHardwareKnob("ENCODER_" + ccNr);
        this.host = host;
        final RelativeHardwareValueMatcher stepUpMatcher =
            midiIn.createRelativeValueMatcher("(status == 176 && data1 == %d && data2==1)".formatted(ccNr), 1);
        final RelativeHardwareValueMatcher stepDownMatcher =
            midiIn.createRelativeValueMatcher("(status == 176 && data1 == %d && data2==127)".formatted(ccNr), -1);
        
        final RelativeHardwareValueMatcher matcher =
            host.createOrRelativeHardwareValueMatcher(stepDownMatcher, stepUpMatcher);
        encoder.setAdjustValueMatcher(matcher);
        encoder.setStepSize(1);
    }
    
    public void setStepSize(final double value) {
        encoder.setStepSize(value);
    }
    
    public void bindParameter(final Layer layer, final Parameter parameter) {
        final RelativeValueBinding binding = new RelativeValueBinding(encoder, parameter);
        layer.addBinding(binding);
    }
    
    public void bind(final Layer layer, final SettableRangedValue value) {
        final RelativeValueBinding binding = new RelativeValueBinding(encoder, value);
        layer.addBinding(binding);
    }
    
    public void bind(final Layer layer, IntConsumer action) {
        final HardwareActionBindable incAction = host.createAction(() -> action.accept(1), () -> "+");
        final HardwareActionBindable decAction = host.createAction(() -> action.accept(-1), () -> "-");
        layer.bind(encoder, host.createRelativeHardwareControlStepTarget(incAction, decAction));
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/Encoder.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import java.util.function.IntConsumer;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.values.Midi;

public class Encoder {
   private final RelativeHardwareKnob encoder;

   public Encoder(int ccNr, final HardwareSurface surface, MidiIn midiIn) {
      encoder = surface.createRelativeHardwareKnob("ENCODER_" + ccNr);
   
      final String matchExpr = String.format("(status==%d && data1==%d && data2>0)", Midi.CC, ccNr);
      encoder.setAdjustValueMatcher(midiIn.createRelative2sComplementValueMatcher(matchExpr, "data2", 7, 200));
      encoder.setStepSize(0.1);
   }

   public void setStepSize(final double value) {
      encoder.setStepSize(value);
   }

   public void bindParameter(final Layer layer, final Parameter parameter) {
      final RelativeValueBinding binding = new RelativeValueBinding(encoder, parameter);
      layer.addBinding(binding);
   }

   public void bind(final Layer layer, final SettableRangedValue value) {
      final RelativeValueBinding binding = new RelativeValueBinding(encoder, value);
      layer.addBinding(binding);
   }
   
   public void bind(ControllerHost host, final Layer layer, IntConsumer changeAction) {
      final HardwareActionBindable incAction = host.createAction(() -> changeAction.accept(1), () -> "+");
      final HardwareActionBindable decAction = host.createAction(() -> changeAction.accept(-1), () -> "-");
      layer.bind(encoder, host.createRelativeHardwareControlStepTarget(incAction, decAction));
   }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/RelativeValueBinding.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import com.bitwig.extension.controller.api.HardwareBinding;
import com.bitwig.extension.controller.api.RelativeHardwareControlBinding;
import com.bitwig.extension.controller.api.RelativeHardwareKnob;
import com.bitwig.extension.controller.api.SettableRangedValue;
import com.bitwig.extensions.framework.Binding;

public class RelativeValueBinding extends Binding<RelativeHardwareKnob, SettableRangedValue> {

   private HardwareBinding hwBinding;

   public RelativeValueBinding(final RelativeHardwareKnob source, final SettableRangedValue target) {
      super(source, source, target);
   }

   protected RelativeHardwareControlBinding getHardwareBinding() {
      return getTarget().addBinding(getSource());
   }

   public void reset() {
      if (!isActive()) {
         return;
      }
      if (hwBinding != null) {
         hwBinding.removeBinding();
      }
      hwBinding = getHardwareBinding();
   }

   @Override
   protected void deactivate() {
      if (hwBinding != null) {
         hwBinding.removeBinding();
         hwBinding = null;
      }
   }

   @Override
   protected void activate() {
      if (hwBinding != null) {
         hwBinding.removeBinding();
      }
      hwBinding = getHardwareBinding();
   }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/RgbButton.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.novation.commonsmk3.ColorLookup;
import com.bitwig.extensions.framework.values.Midi;

public class RgbButton extends ApcButton {

    public RgbButton(final int channel, final int noteNr, final String name, final HardwareSurface surface,
                     final MidiProcessor midiProcessor) {
        super(channel, noteNr, name, surface, midiProcessor);
        light.state().setValue(RgbLightState.OFF);
        light.setColorToStateFunction(this::colorToState);
        if (channel == 9) {
            light.state().onUpdateHardware(this::updateDrumState);
        } else {
            light.state().onUpdateHardware(this::updateState);
        }
    }

    private InternalHardwareLightState colorToState(final Color color) {
        return RgbLightState.of(ColorLookup.toColor(color.getRed255(), color.getGreen255(), color.getBlue255()));
    }

    private void updateDrumState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof RgbLightState state) {
            midiProcessor.sendMidi(Midi.NOTE_ON | 0x9, midiId, state.getColorIndex());
        } else {
            midiProcessor.sendMidi(Midi.NOTE_ON, midiId, 0);
        }
    }


    private void updateState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof RgbLightState state) {
            midiProcessor.sendMidi(state.getMidiCode(), midiId, state.getColorIndex());
        } else {
            midiProcessor.sendMidi(Midi.NOTE_ON, midiId, 0);
        }
    }

    @Override
    public void refresh() {
        updateState(light.state().currentValue());
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/SingleLedButton.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.SingleLedState;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.framework.values.Midi;

public class SingleLedButton extends ApcButton {

    public SingleLedButton(final int noteNr, String name, final HardwareSurface surface,
                           final MidiProcessor midiProcessor) {
        super(0, noteNr, name, surface, midiProcessor);
        light.state().setValue(RgbLightState.OFF);
        light.state().onUpdateHardware(this::updateState);
    }

    private void updateState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof SingleLedState) {
            final SingleLedState state = (SingleLedState) internalHardwareLightState;
            midiProcessor.sendMidi(Midi.NOTE_ON, midiId, state.getCode());
        } else {
            midiProcessor.sendMidi(Midi.NOTE_ON, midiId, 0);
        }
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/led/ColorLookup.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.led;

public class ColorLookup {
    private static final Hsb BLACK_HSB = new Hsb(0, 0, 0);

    public static int toColor(final float r, final float g, final float b) {
        final int rv = (int) Math.floor(r * 255);
        final int gv = (int) Math.floor(g * 255);
        final int bv = (int) Math.floor(b * 255);
        if (rv < 10 && gv < 10 && bv < 10) {
            return 0; // black
        } else if (rv > 230 && gv > 230 && bv > 230) {
            return 3; // white
        } else if (rv == gv && bv == gv) {
            final int bright = rv >> 4;
            if (bright > 7) {
                return 2; // gray
            } else {
                return 1;
            }
        } else {
            final Hsb hsb = ColorLookup.rgbToHsb(rv, gv, bv);
            int hueInd = hsb.hue > 6 ? hsb.hue - 1 : hsb.hue;
            hueInd = Math.min(13, hueInd);
            int color = 5 + hueInd * 4 + 1;
            if (hsb.sat < 8) {
                color -= 2;
            } else if (hsb.bright <= 8) {
                color += 2;
            }
            // return color;
            return adjust(color);
        }
    }

    private static int adjust(final int c) {
        final int rst = (c - 2) % 4;
        if (rst == 0) {
            return c - 1;
        }
        return c;
    }

    public static Hsb rgbToHsb(final float rv, final float gv, final float bv) {
        final float rgb_max = Math.max(Math.max(rv, gv), bv);
        final float rgb_min = Math.min(Math.min(rv, gv), bv);
        final int bright = (int) rgb_max;
        if (bright == 0) {
            return BLACK_HSB; // Black
        }
        final int sat = (int) (255 * (rgb_max - rgb_min) / bright);
        if (sat == 0) {
            return BLACK_HSB; // White
        }
        float hue;
        if (rgb_max == rv) {
            hue = 0 + 43 * (gv - bv) / (rgb_max - rgb_min);
        } else if (rgb_max == gv) {
            hue = 85 + 43 * (bv - rv) / (rgb_max - rgb_min);
        } else {
            hue = 171 + 43 * (rv - gv) / (rgb_max - rgb_min);
        }
        if (hue < 0) {
            hue = 256 + hue;
        }
        return new Hsb((int) Math.floor(hue / 16.0 + 0.3), sat >> 4, bright >> 4);
    }

    public static class Hsb {
        public final int hue;
        public final int sat;
        public final int bright;

        public Hsb(final int hue, final int sat, final int bright) {
            super();
            this.hue = hue;
            this.sat = sat;
            this.bright = bright;
        }

        @Override
        public String toString() {
            final StringBuilder sb = new StringBuilder("Hsb{");
            sb.append("hue=").append(hue);
            sb.append(", sat=").append(sat);
            sb.append(", bright=").append(bright);
            sb.append('}');
            return sb.toString();
        }
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/led/LedBehavior.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.led;

public enum LedBehavior {
    LIGHT_10(0),
    LIGHT_25(1),
    LIGHT_50(2),
    LIGHT_60(3),
    LIGHT_75(4),
    LIGHT_90(5),
    FULL(6),
    PULSE_16(7),
    PULSE_8(8),
    PULSE_4(9),
    PULSE_2(10),
    BLINK_24(11),
    BLINK_16(12),
    BLINK_8(13),
    BLINK_4(14),
    BLINK_2(15);
    final int code;

    LedBehavior(int code) {
        this.code = code;
     }
    
    public int getCode() {
        return code;
    }
    
 }



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/led/RgbLightState.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.led;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extensions.framework.values.Midi;

import java.util.HashMap;
import java.util.Map;

public class RgbLightState extends InternalHardwareLightState {

    private static final Map<Integer, RgbLightState> STATE_MAP = new HashMap<>();

    public static final RgbLightState OFF = new RgbLightState(0);
    public static final RgbLightState WHITE = RgbLightState.of(3);
    public static final RgbLightState WHITE_BRIGHT = RgbLightState.of(3, LedBehavior.FULL);
    public static final RgbLightState WHITE_SEL = RgbLightState.of(3, LedBehavior.PULSE_2);
    public static final RgbLightState WHITE_DIM = RgbLightState.of(1);
    public static final RgbLightState RED = new RgbLightState(5);
    public static final RgbLightState GREEN = new RgbLightState(21);
    public static final RgbLightState RED_FULL = new RgbLightState(5, LedBehavior.FULL);
    public static final RgbLightState RED_DIM = new RgbLightState(5, LedBehavior.LIGHT_10);
    public static final RgbLightState YELLOW_FULL = new RgbLightState(13, LedBehavior.FULL);
    public static final RgbLightState YELLOW_DIM = new RgbLightState(13, LedBehavior.LIGHT_10);
    public static final RgbLightState ORANGE_FULL = new RgbLightState(9, LedBehavior.FULL);
    public static final RgbLightState ORANGE_SEL = new RgbLightState(9, LedBehavior.PULSE_2);
    public static final RgbLightState ORANGE_DIM = new RgbLightState(9, LedBehavior.LIGHT_10);
    public static final RgbLightState GREEN_PLAY = new RgbLightState(21, LedBehavior.PULSE_2);

    public static final RgbLightState MUTE_PLAY_DIM = new RgbLightState(10, LedBehavior.LIGHT_10);
    public static final RgbLightState MUTE_PLAY_FULL = new RgbLightState(10, LedBehavior.FULL);
    public static final RgbLightState SOLO_PLAY_FULL = new RgbLightState(14, LedBehavior.FULL);
    public static final RgbLightState SOLO_PLAY_YELLOW_DIM = new RgbLightState(14, LedBehavior.LIGHT_10);

    private final int colorIndex;
    private final LedBehavior ledBehavior;

    public static RgbLightState of(final int colorIndex) {
        return STATE_MAP.computeIfAbsent(colorIndex | LedBehavior.FULL.getCode() << 8,
                index -> new RgbLightState(colorIndex));
    }

    public static RgbLightState of(final int colorIndex, final LedBehavior behavior) {
        return STATE_MAP.computeIfAbsent(colorIndex | behavior.getCode() << 8,
                index -> new RgbLightState(colorIndex, behavior));
    }

    public RgbLightState behavior(final LedBehavior behavior) {
        if (this.ledBehavior == behavior) {
            return this;
        }
        return of(this.colorIndex, behavior);
    }

    private RgbLightState(final int colorIndex) {
        this(colorIndex, LedBehavior.FULL);
    }

    private RgbLightState(final int colorIndex, final LedBehavior ledBehavior) {
        this.colorIndex = colorIndex;
        this.ledBehavior = ledBehavior;
    }

    public int getColorIndex() {
        return colorIndex;
    }

    public int getMidiCode() {
        return Midi.NOTE_ON | ledBehavior.getCode();
    }

    @Override
    public HardwareLightVisualState getVisualState() {
        if (colorIndex == 0) {
            return null;
        }
        return HardwareLightVisualState.createForColor(Color.fromRGB(255, 0, 0));
    }

    @Override
    public boolean equals(final Object o) {
        if (o instanceof RgbLightState other) {
            return other.colorIndex == colorIndex && other.ledBehavior == ledBehavior;
        }
        return false;
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/led/SingleLedState.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.led;

import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;

public class SingleLedState extends InternalHardwareLightState {
    
    public static final SingleLedState OFF = new SingleLedState(0);
    public static final SingleLedState ON = new SingleLedState(1);
    public static final SingleLedState BLINK = new SingleLedState(2);
    
    private final int code;
    
    private SingleLedState(int code) {
        this.code = code;
    }
    
    public int getCode() {
        return code;
    }
    
    @Override
    public HardwareLightVisualState getVisualState() {
        return null;
    }
    
    @Override
    public boolean equals(final Object o) {
        if(o == this) {
            return true;
        }
        if(o instanceof SingleLedState) {
            return ((SingleLedState)o).code == code;
        }
        return false;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/led/VarSingleLedState.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.led;

import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;

public class VarSingleLedState extends InternalHardwareLightState {
    
    public static final VarSingleLedState OFF = new VarSingleLedState(0);
    public static final VarSingleLedState LIGHT_10= new VarSingleLedState(1);
    public static final VarSingleLedState LIGHT_25= new VarSingleLedState(2);
    public static final VarSingleLedState LIGHT_50= new VarSingleLedState(3);
    public static final VarSingleLedState LIGHT_60= new VarSingleLedState(4);
    public static final VarSingleLedState LIGHT_75= new VarSingleLedState(5);
    public static final VarSingleLedState LIGHT_90= new VarSingleLedState(6);
    public static final VarSingleLedState FULL= new VarSingleLedState(7);
    public static final VarSingleLedState PULSE_16= new VarSingleLedState(8);
    public static final VarSingleLedState PULSE_8= new VarSingleLedState(9);
    public static final VarSingleLedState PULSE_4= new VarSingleLedState(10);
    public static final VarSingleLedState PULSE_2= new VarSingleLedState(11);
    public static final VarSingleLedState BLINK_24= new VarSingleLedState(12);
    public static final VarSingleLedState BLINK_16= new VarSingleLedState(13);
    public static final VarSingleLedState BLINK_8= new VarSingleLedState(14);
    public static final VarSingleLedState BLINK_4= new VarSingleLedState(15);
    public static final VarSingleLedState BLINK_2= new VarSingleLedState(16);
    
    private final int code;
    
    protected VarSingleLedState(int code) {
        this.code = code;
    }
    
    public int getCode() {
        return code == 0 ? 0 : 1;
    }
    
    public int getChannel() {
        return code == 0 ? 0 : code-1;
    }
    
    @Override
    public HardwareLightVisualState getVisualState() {
        return null;
    }
    
    @Override
    public boolean equals(final Object o) {
        if(o == this) {
            return true;
        }
        if(o instanceof VarSingleLedState) {
            return ((VarSingleLedState)o).code == code;
        }
        return false;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc40_mkii/APC40MKIIControllerExtensionDefinition.java
================================================
package com.bitwig.extensions.controllers.akai.apc40_mkii;

import java.util.UUID;

import com.bitwig.extension.api.PlatformType;
import com.bitwig.extension.controller.AutoDetectionMidiPortNamesList;
import com.bitwig.extension.controller.ControllerExtension;
import com.bitwig.extension.controller.ControllerExtensionDefinition;
import com.bitwig.extension.controller.api.ControllerHost;

public class APC40MKIIControllerExtensionDefinition extends ControllerExtensionDefinition
{
   private final static UUID ID = UUID.fromString("0b134b19-a791-4aa8-8a2f-1fdd2b73c4fc");

   @Override
   public String getName()
   {
      return "APC40 mkII";
   }

   @Override
   public String getVersion()
   {
      return "1.2";
   }

   @Override
   public String getAuthor()
   {
      return "Bitwig";
   }

   @Override
   public UUID getId()
   {
      return ID;
   }

   @Override
   public int getRequiredAPIVersion()
   {
      return 18;
   }

   @Override
   public String getHardwareVendor()
   {
      return "Akai";
   }

   @Override
   public String getHardwareModel()
   {
      return getName();
   }

   @Override
   public String getHelpFilePath()
   {
      return "Controllers/Akai/APC40 MKII.pdf";
   }

   @Override
   public int getNumMidiInPorts()
   {
      return 1;
   }

   @Override
   public int getNumMidiOutPorts()
   {
      return 1;
   }

   @Override
   public ControllerExtension createInstance(final ControllerHost host)
   {
      return new APC40MKIIControllerExtension(this, host);
   }

   @Override
   public void listAutoDetectionMidiPortNames(
      final AutoDetectionMidiPortNamesList list,
      final PlatformType platformType)
   {
      final String[] inputNames = new String[1];
      final String[] outputNames = new String[1];

      switch (platformType)
      {
         case LINUX ->
         {
            inputNames[0] = "APC40 mkII MIDI 1";
            outputNames[0] = "APC40 mkII MIDI 1";
         }
         case WINDOWS, MAC ->
         {
            inputNames[0] = "APC40 mkII";
            outputNames[0] = "APC40 mkII";
         }
      }

      list.add(inputNames, outputNames);
   }

   public static APC40MKIIControllerExtensionDefinition getInstance()
   {
      return mInstance;
   }

   private static final APC40MKIIControllerExtensionDefinition mInstance = new APC40MKIIControllerExtensionDefinition();
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc40_mkii/CrossFadeMode.java
================================================
package com.bitwig.extensions.controllers.akai.apc40_mkii;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extension.controller.api.Track;

class CrossFadeMode extends InternalHardwareLightState
{
    public static final CrossFadeMode A = new CrossFadeMode("A", 0, 1);

    public static final CrossFadeMode B = new CrossFadeMode("B", 1, 2);

    public static final CrossFadeMode AB = new CrossFadeMode("AB", 2, 0);

    public static CrossFadeMode getBestModeForColor(final Color color)
    {
        if (color == null || color.getAlpha() == 0
            || color.getRed() == 0 && color.getGreen() == 0 && color.getBlue() == 0)
            return AB;

        if (B_COLOR.equals(color))
            return B;

        return A;
    }

    public static CrossFadeMode forEnumName(final String name)
    {
        if (name.equals(A.mEnumName))
            return A;
        if (name.equals(B.mEnumName))
            return B;
        return AB;
    }

    public static CrossFadeMode forTrack(final Track track)
    {
        return forEnumName(track.crossFadeMode().get());
    }

    private static CrossFadeMode forIndex(final int index)
    {
        final CrossFadeMode mode = switch (index)
        {
        case 0 -> A;
        case 1 -> B;
        default -> AB;
        };

        assert mode.getIndex() == index;

        return mode;
    }

    private CrossFadeMode(final String enumName, final int index, final int colorIndex)
    {
        mEnumName = enumName;
        mIndex = index;
        mColorIndex = colorIndex;
    }

    public int getIndex()
    {
        return mIndex;
    }

    /** The color value we need to send to the hardware */
    public int getColorIndex()
    {
        return mColorIndex;
    }

    public CrossFadeMode getNext()
    {
        final int index = (mColorIndex + 1) % 3;

        return forIndex(index);
    }

    public String getEnumName()
    {
        return mEnumName;
    }

    @Override
    public HardwareLightVisualState getVisualState()
    {
        if (this == AB)
            return null;

        if (this == A)
            return A_VISUAL_STATE;

        return B_VISUAL_STATE;
    }

    @Override
    public boolean equals(final Object obj)
    {
        return this == obj;
    }

    private final String mEnumName;

    private final int mColorIndex, mIndex;

    private static final Color A_COLOR = Color.fromRGB(1, 0.64, 0);

    private static final Color B_COLOR = Color.fromRGB(0, 0, 1);

    private static final HardwareLightVisualState A_VISUAL_STATE = HardwareLightVisualState
        .createForColor(A_COLOR);

    private static final HardwareLightVisualState B_VISUAL_STATE = HardwareLightVisualState
        .createForColor(B_COLOR);
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc40_mkii/KnobLed.java
================================================
package com.bitwig.extensions.controllers.akai.apc40_mkii;

import com.bitwig.extension.controller.api.MidiOut;

public class KnobLed
{
   public static final int RING_INIT = -1;

   public static final int RING_OFF = 0;

   public static final int RING_SINGLE = 1;

   public static final int RING_VOLUME = 2;

   public static final int RING_PAN = 3;

   public void flush(final MidiOut midiOut, final int msg, final int channel, final int data1)
   {
      if (mRing != mDisplayedRing)
      {
         assert mRing >= 0;
         assert mRing < 128;

         midiOut.sendMidi((msg << 4) | channel, data1 + 8, mRing);
         mDisplayedRing = mRing;
      }

      if (mValue != mDisplayedValue)
      {
         assert mValue >= 0;
         assert mValue < 128;

         midiOut.sendMidi((msg << 4) | channel, data1, mValue);
         mDisplayedValue = mValue;
      }
   }

   public boolean wantsFlush()
   {
      return mRing != mDisplayedRing || mValue != mDisplayedValue;
   }

   public void set(final int value)
   {
      assert value >= 0;
      assert value < 128;

      mValue = Math.min(127, Math.max(0, value));
   }

   public void setDisplayedValue(final int value)
   {
      assert value >= 0;
      assert value < 128;

      mValue = value;
      mDisplayedValue = value;
   }

   public void setRing(final int ring)
   {
      mRing = ring;
   }

   private int mValue = 0;

   private int mDisplayedValue = -1;

   private int mRing = RING_OFF;

   private int mDisplayedRing = RING_INIT;
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc40_mkii/RgbLed.java
================================================
package com.bitwig.extensions.controllers.akai.apc40_mkii;

import com.bitwig.extension.controller.api.HardwareButton;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.MidiOut;
import com.bitwig.extension.controller.api.MultiStateHardwareLight;

class RgbLed
{
   protected RgbLed(
      final HardwareButton button,
      final HardwareSurface surface,
      final int message,
      final int data1,
      final MidiOut midiOut)
   {
      super();
      mMessage = message;
      mData1 = data1;

      mLight = surface.createMultiStateHardwareLight(button.getId() + "-light");
      mLight.setColorToStateFunction(RGBLedState::getBestStateForColor);
      mLight.state().onUpdateHardware(state -> sendLightState(midiOut, (RGBLedState)state));
      button.setBackgroundLight(mLight);
   }

   public MultiStateHardwareLight getLight()
   {
       return mLight;
   }

   private void sendLightState(final MidiOut midiOut, RGBLedState state)
   {
      if (state == null)
         state = RGBLedState.OFF_STATE;
         
      final var color = state.getColor();
      final var blinkColor = state.getBlinkColor();
      final var blinkType = state.getBlinkType();
      
      midiOut.sendMidi(mMessage << 4, mData1, color);

      if (blinkType != RGBLedState.BLINK_NONE)
      {
         midiOut.sendMidi(mMessage << 4, mData1, blinkColor);
         midiOut.sendMidi((mMessage << 4) | blinkType, mData1, color);
      }
      else
      {
         midiOut.sendMidi(mMessage << 4, mData1, color);
      }
   }

   private final MultiStateHardwareLight mLight;

   private final int mMessage, mData1;
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc40_mkii/RGBLedState.java
================================================
package com.bitwig.extensions.controllers.akai.apc40_mkii;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;

class RGBLedState extends InternalHardwareLightState
{
   /** Array of colors that the protocol specifies. */
   private static final Color[] COLORS = new Color[128];

   public static final int COLOR_NONE = 0;

   public static final int COLOR_WHITE = 3;

   public static final int COLOR_RED = 5;

   public static final int COLOR_GREEN = 21;

   public static final int COLOR_YELLOW = 13;

   public static final int COLOR_RECORDING = COLOR_RED;

   public static final int COLOR_PLAYING = COLOR_GREEN;

   public static final int COLOR_PLAYING_QUEUED = COLOR_YELLOW;

   public static final int COLOR_STOPPING = COLOR_NONE;

   public static final int COLOR_SELECTED = COLOR_YELLOW;

   public static final int COLOR_SELECTABLE = 1;

   public static final int BLINK_NONE = 0;

   public static final int BLINK_PLAY_QUEUED = 14;

   public static final int BLINK_ACTIVE = 10;

   public static final int BLINK_RECORD_QUEUED = 13;

   public static final int BLINK_STOP_QUEUED = 13;

   public static final RGBLedState OFF_STATE = new RGBLedState(COLOR_NONE, COLOR_NONE, BLINK_NONE);

   /**
    * Registers a color as defined in the APC 40 mkii MIDI protocol. The color value is the velocity to use
    * for the provided RGB integer color.
    */
   private static void registerColor(final int rgb, final int value)
   {
      assert value >= 0 && value <= 127;
      assert COLORS[value] == null;

      COLORS[value] = createColorForRGBInt(rgb);
   }

   private static Color createColorForRGBInt(final int rgb)
   {
      final int red = (rgb & 0xFF0000) >> 16;
      final int green = (rgb & 0xFF00) >> 8;
      final int blue = rgb & 0xFF;

      return Color.fromRGB255(red, green, blue);
   }

   private static double[] rgbToHsv(final Color color)
   {
      final double[] hsv = new double[3];

      final double r = color.getRed();
      final double g = color.getGreen();
      final double b = color.getBlue();

      final double max = Math.max(r, Math.max(g, b));
      final double min = Math.min(r, Math.min(g, b));
      final double delta = max - min;

      // Calculate hue
      if (delta == 0)
      {
         hsv[0] = 0;
      }
      else if (max == r)
      {
         hsv[0] = (60 * ((g - b) / delta) + 360) % 360;
      }
      else if (max == g)
      {
         hsv[0] = (60 * ((b - r) / delta) + 120) % 360;
      }
      else if (max == b)
      {
         hsv[0] = (60 * ((r - g) / delta) + 240) % 360;
      }

      // Calculate saturation
      hsv[1] = (max == 0) ? 0 : (delta / max);

      // Calculate value
      hsv[2] = max;

      return hsv;
   }

   private static double colorDistance(final Color color1, final Color color2)
   {
      return 0.5 * colorDistanceRGB(color1, color2) + 0.5 * colorDistanceHSV(color1, color2);
   }

   private static double colorDistanceRGB(final Color color1, final Color color2)
   {
      final double r1 = color1.getRed();
      final double g1 = color1.getGreen();
      final double b1 = color1.getBlue();

      final double r2 = color2.getRed();
      final double g2 = color2.getGreen();
      final double b2 = color2.getBlue();

      final double dr = r2 - r1;
      final double dg = g2 - g1;
      final double db = b2 - b1;

      return Math.sqrt(dr * dr + dg * dg + db * db);
   }

   private static double colorDistanceHSV(final Color color1, final Color color2)
   {
      final double[] hsv1 = rgbToHsv(color1);
      final double[] hsv2 = rgbToHsv(color2);

      final double dh = Math.min(Math.abs(hsv1[0] - hsv2[0]), 1 - Math.abs(hsv1[0] - hsv2[0]));
      final double ds = Math.abs(hsv1[1] - hsv2[1]);
      final double dv = Math.abs(hsv1[2] - hsv2[2]);

      return Math.sqrt(dh * dh + ds * ds + dv * dv);
   }

   private static record ColorToIndexCacheEntry(int rgb, int index)
   {
   }

   private static final int colorToRGBInt(final Color color)
   {
      return color.getRed255() << 16 | color.getGreen255() << 8 | color.getBlue255();
   }

   private static final Map<Integer, Integer> HANDPICKED_RGBINT_TO_CLOSEST_COLOR_INDEX = new HashMap<>();

   private static void registerHandpickedClosestColor(final int rgb, final int colorIndex)
   {
      HANDPICKED_RGBINT_TO_CLOSEST_COLOR_INDEX.put(rgb, colorIndex);
   }

   static 
   {
      registerHandpickedClosestColor(0xFF0000, COLOR_RED);
      registerHandpickedClosestColor(0xFF00, COLOR_GREEN);
      registerHandpickedClosestColor(0xFF, 45);
      registerHandpickedClosestColor(0xFFD90F, COLOR_YELLOW);

      registerHandpickedClosestColor(0, 0);

      registerHandpickedClosestColor(14235761, 57);
      registerHandpickedClosestColor(14771857, 107);
      registerHandpickedClosestColor(5526612, 1);

      registerHandpickedClosestColor(14233124, 6);
      registerHandpickedClosestColor(15491415, 5);
      registerHandpickedClosestColor(8026746, 2);

      registerHandpickedClosestColor(16733958, 9);
      registerHandpickedClosestColor(16745278, 12);
      registerHandpickedClosestColor(13224393, 3);

      registerHandpickedClosestColor(14261520, 14);
      registerHandpickedClosestColor(14989134, 13);
      registerHandpickedClosestColor(8817068, 104);

      registerHandpickedClosestColor(7575572, 18);
      registerHandpickedClosestColor(10534988, 17);
      registerHandpickedClosestColor(10713411, 125);

      registerHandpickedClosestColor(40263, 22);
      registerHandpickedClosestColor(4111202, 21);
      registerHandpickedClosestColor(13016944, 124);

      registerHandpickedClosestColor(42644, 34);
      registerHandpickedClosestColor(4444857, 33);
      registerHandpickedClosestColor(5726662, 43);

      registerHandpickedClosestColor(39385, 38);
      registerHandpickedClosestColor(4507903, 37);
      registerHandpickedClosestColor(8686304, 115);

      registerHandpickedClosestColor(9783755, 50);
      registerHandpickedClosestColor(12351216, 49);
   }

   private static final ArrayList<ColorToIndexCacheEntry> RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE = new ArrayList<>();

   public static int getClosestColorIndex(final Color color)
   {
      if (color == null || color.getAlpha() == 0)
         return 0;

      final int rgb = colorToRGBInt(color);

      final Integer handPickedColorIndex = HANDPICKED_RGBINT_TO_CLOSEST_COLOR_INDEX.get(rgb);

      if (handPickedColorIndex != null)
         return handPickedColorIndex;

      final int MAX_CACHE_SIZE = 64;

      synchronized (RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE)
      {
         final int cacheSize = RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE.size();

         for (int i = 0; i < cacheSize; i++)
         {
            final var cacheEntry = RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE.get(i);

            if (cacheEntry.rgb == rgb)
               return cacheEntry.index;
         }

         final int colorIndex = computeClosestColorIndex(color);

         if (cacheSize == MAX_CACHE_SIZE)
            RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE.remove(MAX_CACHE_SIZE - 1);

         RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE.add(0, new ColorToIndexCacheEntry(rgb, colorIndex));

         return colorIndex;
      }
   }

   private static int computeClosestColorIndex(final Color color)
   {
      if (color == null || color.getAlpha() == 0)
         return 0;

      int closestIndex = 0;
      double closestDistance = Double.MAX_VALUE;

      for (int i = 0; i < COLORS.length; i++)
      {
         final Color currentColor = COLORS[i];
         final double distance = colorDistance(color, currentColor);

         if (distance == 0)
            return i;

         if (distance < closestDistance)
         {
            closestIndex = i;
            closestDistance = distance;
         }
      }

      return closestIndex;
   }

   public static Color getColorForColorValue(final int colorValue)
   {
      assert colorValue >= 0 && colorValue < COLORS.length;

      if (colorValue < 0 || colorValue >= COLORS.length)
         return COLORS[0];

      return COLORS[colorValue];
   }

   public static RGBLedState getBestStateForColor(final Color color)
   {
      final int colorIndex = getClosestColorIndex(color);

      return new RGBLedState(colorIndex, COLOR_NONE, BLINK_NONE);
   }

   public RGBLedState(final int color, final int blinkColor, final int blinkType)
   {
      super();
      mColor = color;
      mBlinkColor = blinkColor;
      mBlinkType = blinkType;
   }

   public int getColor()
   {
      return mColor;
   }

   public int getBlinkColor()
   {
      return mBlinkColor;
   }

   public int getBlinkType()
   {
      return mBlinkType;
   }

   @Override
   public int hashCode()
   {
      final int prime = 31;
      int result = 1;
      result = prime * result + mBlinkColor;
      result = prime * result + mBlinkType;
      result = prime * result + mColor;
      return result;
   }

   @Override
   public boolean equals(final Object obj)
   {
      if (this == obj)
         return true;
      if (obj == null)
         return false;
      if (getClass() != obj.getClass())
         return false;
      final RGBLedState other = (RGBLedState)obj;
      if (mBlinkColor != other.mBlinkColor)
         return false;
      if (mBlinkType != other.mBlinkType)
         return false;
      if (mColor != other.mColor)
         return false;
      return true;
   }

   @Override
   public HardwareLightVisualState getVisualState()
   {
      final Color color = getColorForColorValue(mColor);

      if (mBlinkType == BLINK_NONE)
         return HardwareLightVisualState.createForColor(color);

      final Color offColor = getColorForColorValue(mBlinkColor);

      if (mBlinkType == BLINK_PLAY_QUEUED)
         return HardwareLightVisualState.createBlinking(color, offColor, 0.2, 0.2);

      return HardwareLightVisualState.createBlinking(color, offColor, 0.5, 0.5);
   }

   private final int mColor, mBlinkColor, mBlinkType;

   static
   {
      registerColor(0x000000, 0);
      registerColor(0x1E1E1E, 1);
      registerColor(0x7F7F7F, 2);
      registerColor(0xFFFFFF, 3);
      registerColor(0xFF4C4C, 4);
      registerColor(0xFF0000, 5);
      registerColor(0x590000, 6);
      registerColor(0x190000, 7);
      registerColor(0xFFBD6C, 8);
      registerColor(0xFF5400, 9);
      registerColor(0x591D00, 10);
      registerColor(0x271B00, 11);
      registerColor(0xFFFF4C, 12);
      registerColor(0xFFFF00, 13);
      registerColor(0x595900, 14);
      registerColor(0x191900, 15);
      registerColor(0x88FF4C, 16);
      registerColor(0x54FF00, 17);
      registerColor(0x1D5900, 18);
      registerColor(0x142B00, 19);
      registerColor(0x4CFF4C, 20);
      registerColor(0x00FF00, 21);
      registerColor(0x005900, 22);
      registerColor(0x001900, 23);
      registerColor(0x4CFF5E, 24);
      registerColor(0x00FF19, 25);
      registerColor(0x00590D, 26);
      registerColor(0x001902, 27);
      registerColor(0x4CFF88, 28);
      registerColor(0x00FF55, 29);
      registerColor(0x00591D, 30);
      registerColor(0x001F12, 31);
      registerColor(0x4CFFB7, 32);
      registerColor(0x00FF99, 33);
      registerColor(0x005935, 34);
      registerColor(0x001912, 35);
      registerColor(0x4CC3FF, 36);
      registerColor(0x00A9FF, 37);
      registerColor(0x004152, 38);
      registerColor(0x001019, 39);
      registerColor(0x4C88FF, 40);
      registerColor(0x0055FF, 41);
      registerColor(0x001D59, 42);
      registerColor(0x000819, 43);
      registerColor(0x4C4CFF, 44);
      registerColor(0x0000FF, 45);
      registerColor(0x000059, 46);
      registerColor(0x000019, 47);
      registerColor(0x874CFF, 48);
      registerColor(0x5400FF, 49);
      registerColor(0x190064, 50);
      registerColor(0x0F0030, 51);
      registerColor(0xFF4CFF, 52);
      registerColor(0xFF00FF, 53);
      registerColor(0x590059, 54);
      registerColor(0x190019, 55);
      registerColor(0xFF4C87, 56);
      registerColor(0xFF0054, 57);
      registerColor(0x59001D, 58);
      registerColor(0x220013, 59);
      registerColor(0xFF1500, 60);
      registerColor(0x993500, 61);
      registerColor(0x795100, 62);
      registerColor(0x436400, 63);
      registerColor(0x033900, 64);
      registerColor(0x005735, 65);
      registerColor(0x00547F, 66);
      registerColor(0x0000FF, 67);
      registerColor(0x00454F, 68);
      registerColor(0x2500CC, 69);
      registerColor(0x7F7F7F, 70);
      registerColor(0x202020, 71);
      registerColor(0xFF0000, 72);
      registerColor(0xBDFF2D, 73);
      registerColor(0xAFED06, 74);
      registerColor(0x64FF09, 75);
      registerColor(0x108B00, 76);
      registerColor(0x00FF87, 77);
      registerColor(0x00A9FF, 78);
      registerColor(0x002AFF, 79);
      registerColor(0x3F00FF, 80);
      registerColor(0x7A00FF, 81);
      registerColor(0xB21A7D, 82);
      registerColor(0x402100, 83);
      registerColor(0xFF4A00, 84);
      registerColor(0x88E106, 85);
      registerColor(0x72FF15, 86);
      registerColor(0x00FF00, 87);
      registerColor(0x3BFF26, 88);
      registerColor(0x59FF71, 89);
      registerColor(0x38FFCC, 90);
      registerColor(0x5B8AFF, 91);
      registerColor(0x3151C6, 92);
      registerColor(0x877FE9, 93);
      registerColor(0xD31DFF, 94);
      registerColor(0xFF005D, 95);
      registerColor(0xFF7F00, 96);
      registerColor(0xB9B000, 97);
      registerColor(0x90FF00, 98);
      registerColor(0x835D07, 99);
      registerColor(0x392b00, 100);
      registerColor(0x144C10, 101);
      registerColor(0x0D5038, 102);
      registerColor(0x15152A, 103);
      registerColor(0x16205A, 104);
      registerColor(0x693C1C, 105);
      registerColor(0xA8000A, 106);
      registerColor(0xDE513D, 107);
      registerColor(0xD86A1C, 108);
      registerColor(0xFFE126, 109);
      registerColor(0x9EE12F, 110);
      registerColor(0x67B50F, 111);
      registerColor(0x1E1E30, 112);
      registerColor(0xDCFF6B, 113);
      registerColor(0x80FFBD, 114);
      registerColor(0x9A99FF, 115);
      registerColor(0x8E66FF, 116);
      registerColor(0x404040, 117);
      registerColor(0x757575, 118);
      registerColor(0xE0FFFF, 119);
      registerColor(0xA00000, 120);
      registerColor(0x350000, 121);
      registerColor(0x1AD000, 122);
      registerColor(0x074200, 123);
      registerColor(0xB9B000, 124);
      registerColor(0x3F3100, 125);
      registerColor(0xB35F00, 126);
      registerColor(0x4B1502, 127);
   }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/Apc64CcAssignments.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

public enum Apc64CcAssignments {
    SCENE_BUTTON_BASE(0x70, true), //
    GRID_BASE(0x0, true),
    STRIP_TOUCH(0x52, true),
    TRACKS_BASE(0x64, true),
    TRACK_CONTROL_BASE(0x40, true),
    NAV_LEFT(0x60),
    NAV_RIGHT(0x61),
    NAV_DOWN(0x5E),
    NAV_UP(0x5F),
    MODE_REC(0x6C),
    MODE_MUTE(0x6D),
    MODE_SOLO(0x6E),
    MODE_STOP(0x6F),
    STRIP_DEVICE(0x79),
    STRIP_VOLUME(0x7A),
    STRIP_PAN(0x7B),
    STRIP_SENDS(0x7C),
    STRIP_CHANNEL(0x7D),
    STRIP_OFF(0x7E),
    CLEAR(0x49),
    DUPLICATE(0x4A),
    FIXED(0x4C),
    QUANTIZE(0x4B),
    UNDO(0x4D),
    TEMPO(0x48),
    SHIFT(0x78),
    PLAY(0x5B),
    STOP(0x5D),
    REC(0x5C);
    
    private int stateId;
    private boolean isBaseStart;
    
    Apc64CcAssignments(final int stateId) {
        this(stateId, false);
    }
    Apc64CcAssignments(final int stateId, boolean isBaseStart) {
        this.isBaseStart = isBaseStart;
        this.stateId = stateId;
    }
    
    public int getStateId() {
        return stateId;
    }
    
    public boolean isBaseStart() {
        return isBaseStart;
    }
    
    public boolean isSingle() {
        return !isBaseStart;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/Apc64Extension.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.ControllerExtension;
import com.bitwig.extension.controller.api.Application;
import com.bitwig.extension.controller.api.ClipLauncherSlot;
import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extension.controller.api.MidiOut;
import com.bitwig.extension.controller.api.NoteInput;
import com.bitwig.extension.controller.api.Project;
import com.bitwig.extension.controller.api.Track;
import com.bitwig.extension.controller.api.Transport;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc.common.led.VarSingleLedState;
import com.bitwig.extensions.controllers.akai.apc64.control.SingleLedButton;
import com.bitwig.extensions.controllers.akai.apc64.layer.OverviewLayer;
import com.bitwig.extensions.controllers.akai.apc64.layer.PadLayer;
import com.bitwig.extensions.controllers.akai.apc64.layer.SessionLayer;
import com.bitwig.extensions.controllers.akai.apc64.layer.TrackAndSceneLayer;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;
import com.bitwig.extensions.framework.di.Context;
import com.bitwig.extensions.framework.values.FocusMode;

import java.time.LocalDateTime;

public class Apc64Extension extends ControllerExtension {
    private static ControllerHost debugHost;
    private HardwareSurface surface;
    private Apc64MidiProcessor midiProcessor;
    private Layer mainLayer;
    private Layer shiftLayer;
    private Transport transport;
    private ViewControl viewControl;
    private FocusClip focusClip;
    private Project project;
    private SessionLayer sessionLayer;
    private OverviewLayer overviewLayer;
    private ApcPreferences preferences;
    private TrackAndSceneLayer sceneAndTrackLayer;
    private PadLayer padLayer;
    private ModifierStates modifierSection;

    public static void println(final String format, final Object... args) {
        if (debugHost != null) {
            final LocalDateTime now = LocalDateTime.now();
            debugHost.println(format.formatted(args));
        }
    }

    protected Apc64Extension(final Apc64ExtensionDefinition definition, final ControllerHost host) {
        super(definition, host);
    }

    @Override
    public void init() {
        debugHost = getHost();
        this.project = getHost().getProject();
        final Context diContext = new Context(this);
        mainLayer = new Layer(diContext.getService(Layers.class), "MAIN_LAYER");
        surface = diContext.getService(HardwareSurface.class);
        initMidi(diContext);
        sessionLayer = diContext.create(SessionLayer.class);
        sceneAndTrackLayer = diContext.create(TrackAndSceneLayer.class);
        overviewLayer = diContext.create(OverviewLayer.class);
        shiftLayer = new Layer(diContext.getService(Layers.class), "SHIFT_LAYER");
        viewControl = diContext.getService(ViewControl.class);
        modifierSection = diContext.getService(ModifierStates.class);

        initMainSection(diContext);
        initTransport(diContext);
        midiProcessor.setHwElements(diContext.getService(HardwareElements.class));
        focusClip = diContext.getService(FocusClip.class);
        preferences = diContext.getService(ApcPreferences.class);
        padLayer = diContext.getService(PadLayer.class);
        sessionLayer.activate();
        sceneAndTrackLayer.activate();
        diContext.activate();
        mainLayer.setIsActive(true);
        midiProcessor.addModeChangeListener(this::handleModeChange);
    }

    private void handleModeChange(final PadMode mode) {
        sessionLayer.setIsActive(mode == PadMode.SESSION);
        overviewLayer.setIsActive(mode == PadMode.OVERVIEW);
        padLayer.setIsActive(mode.isKeyRelated());
    }

    private void initMainSection(final Context context) {
        final HardwareElements hwElements = context.getService(HardwareElements.class);
        final Application application = context.getService(Application.class);

        final SingleLedButton shiftButton = hwElements.getButton(Apc64CcAssignments.SHIFT);
        shiftButton.bindIsPressed(mainLayer, shiftActive -> {
            modifierSection.setShift(shiftActive);
            shiftLayer.setIsActive(shiftActive);
            if (preferences.useShiftForAltMode()) {
                modifierSection.getAltActive().set(shiftActive);
            }
        });

        final SingleLedButton clearButton = hwElements.getButton(Apc64CcAssignments.CLEAR);
        clearButton.bindIsPressed(mainLayer, pressed -> modifierSection.setClear(pressed));
        clearButton.bindLightPressed(mainLayer,
                pressed -> pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10);

        final SingleLedButton duplicateButton = hwElements.getButton(Apc64CcAssignments.DUPLICATE);
        duplicateButton.bindIsPressed(mainLayer, this::handleDuplicatePressed);
        duplicateButton.bindLightPressed(mainLayer,
                pressed -> pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10);

        application.canUndo().markInterested();
        application.canRedo().markInterested();

        final SingleLedButton undoButton = hwElements.getButton(Apc64CcAssignments.UNDO);
        undoButton.bindPressed(mainLayer, () -> application.undo());
        undoButton.bindLightPressed(mainLayer, pressed -> {
            if (application.canUndo().get()) {
                return pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_60;
            }
            return VarSingleLedState.OFF;
        });
        undoButton.bindPressed(shiftLayer, () -> application.redo());
        undoButton.bindLightPressed(shiftLayer, pressed -> {
            if (application.canRedo().get()) {
                return pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_60;
            }
            return VarSingleLedState.OFF;
        });
    }


    private void handleDuplicatePressed(final boolean pressed) {
        modifierSection.setDuplicate(pressed);
        if (padLayer.isActive() && modifierSection.isShift() & pressed) {
            padLayer.duplicateContent();
        }
    }

    private void initTransport(final Context diContext) {
        final HardwareElements hwElements = diContext.getService(HardwareElements.class);
        final FocusClip focusClip = diContext.getService(FocusClip.class);
        transport = diContext.getService(Transport.class);
        transport.isPlaying().markInterested();
        transport.isArrangerRecordEnabled().markInterested();
        transport.isClipLauncherOverdubEnabled().markInterested();
        transport.isArrangerOverdubEnabled().markInterested();

        final SingleLedButton playButton = hwElements.getButton(Apc64CcAssignments.PLAY);
        playButton.bindPressed(mainLayer, () -> transport.play());
        playButton.bindLight(mainLayer,
                () -> transport.isPlaying().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10);

        final SingleLedButton stopButton = hwElements.getButton(Apc64CcAssignments.STOP);
        final Track rootTrack = getHost().getProject().getRootTrackGroup();
        stopButton.bindPressed(mainLayer, () -> transport.stop());
        stopButton.bindLight(mainLayer,
                () -> transport.isPlaying().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10);
        stopButton.bindPressed(shiftLayer, () -> rootTrack.stop());

        final SingleLedButton recButton = hwElements.getButton(Apc64CcAssignments.REC);
        recButton.bindPressed(mainLayer, () -> handleRecordButton(transport, focusClip));
        recButton.bindLight(mainLayer, () -> recordActive(transport));
        recButton.bindPressed(shiftLayer, () -> handleRecordButtonShift(transport));
        recButton.bindLight(mainLayer, () -> recordActiveShift(transport));
    }

    private void handleRecordButton(final Transport transport, final FocusClip focusClip) {
        if (preferences.getRecordFocusMode() == FocusMode.LAUNCHER) {
            focusClip.invokeRecord();
        } else {
            if (transport.isPlaying().get()) {
                transport.isArrangerRecordEnabled().toggle();
            } else {
                transport.isArrangerRecordEnabled().set(true);
                transport.play();
            }
        }
    }

    private void handleRecordButtonShift(final Transport transport) {
        if (preferences.getRecordFocusMode() == FocusMode.LAUNCHER) {
            transport.isClipLauncherOverdubEnabled().toggle();
        } else {
            transport.isArrangerOverdubEnabled().toggle();
        }
    }

    private VarSingleLedState recordActive(final Transport transport) {
        if (preferences.getRecordFocusMode() == FocusMode.LAUNCHER) {
            return transport.isClipLauncherOverdubEnabled().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10;
        }
        return transport.isArrangerRecordEnabled().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10;
    }

    private VarSingleLedState recordActiveShift(final Transport transport) {
        if (preferences.getRecordFocusMode() == FocusMode.LAUNCHER) {
            return transport.isClipLauncherOverdubEnabled().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10;
        }
        return transport.isArrangerOverdubEnabled().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10;
    }

    protected void initMidi(final Context diContext) {
        final ControllerHost host = diContext.getService(ControllerHost.class);
        final MidiIn midiIn = host.getMidiInPort(0);
        final MidiIn midiIn2 = host.getMidiInPort(1);
//        midiIn2.setMidiCallback((msg, d1,d2)-> {
//            Apc64Extension.println("IN2 = %02X %02X %02X",msg,d1,d2);
//        });
        final MidiOut midiOut = host.getMidiOutPort(0);
        midiProcessor = new Apc64MidiProcessor(host, midiIn, midiOut, diContext.getService(ModifierStates.class));
        diContext.registerService(MidiProcessor.class, midiProcessor);
        diContext.registerService(Apc64MidiProcessor.class, midiProcessor);
        final NoteInput noteInput = midiIn2.createNoteInput("MIDI", "8?????", "9?????", "A?????", "D?????", "B?????");
        noteInput.setShouldConsumeEvents(true);
        midiProcessor.setPrintToClipSeqConsumer(this::handlePrintToClip);
        midiProcessor.start();
    }

    int ptcCount = 1;

    private void handlePrintToClip(final PrintToClipSeq printToClipSeq) {
        if (printToClipSeq.hasNotes()) {
            focusClip.focusOnNextEmpty(slot -> {
                if (slot.exists().get()) {
                    createClipFromPrint(printToClipSeq, slot);
                } else {
                    project.createScene();
                    getHost().scheduleTask(() -> {
                        createClipFromPrint(printToClipSeq, slot);
                    }, 40);
                }
            });
        }
    }

    private void createClipFromPrint(final PrintToClipSeq printToClipSeq, final ClipLauncherSlot slot) {
        slot.select();
        slot.showInEditor();
        slot.createEmptyClip(4);
        getHost().scheduleTask(() -> printToClipSeq.applyToClip(viewControl.getCursorClip(), ptcCount++), 40);
    }

    @Override
    public void flush() {
        surface.updateHardware();
    }

    @Override
    public void exit() {
        midiProcessor.exitSessionMode();
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/Apc64ExtensionDefinition.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.api.PlatformType;
import com.bitwig.extension.controller.AutoDetectionMidiPortNamesList;
import com.bitwig.extension.controller.ControllerExtensionDefinition;
import com.bitwig.extension.controller.api.ControllerHost;

import java.util.UUID;

public class Apc64ExtensionDefinition extends ControllerExtensionDefinition {
   private static final UUID DRIVER_ID = UUID.fromString("bc2cae98-42ed-45ef-a191-aef1dfd4e00d");

   public Apc64ExtensionDefinition() {
   }

   @Override
   public String getName() {
      return "APC64";
   }

   @Override
   public String getAuthor() {
      return "Bitwig";
   }

   @Override
   public String getVersion() {
      return "1.0";
   }

   @Override
   public UUID getId() {
      return DRIVER_ID;
   }

   @Override
   public String getHardwareVendor() {
      return "Akai";
   }

   @Override
   public String getHardwareModel() {
      return "APC64";
   }

   @Override
   public int getRequiredAPIVersion() {
      return 18;
   }

   @Override
   public int getNumMidiInPorts() {
      return 2;
   }

   @Override
   public int getNumMidiOutPorts() {
      return 1;
   }

   @Override
   public String getHelpFilePath() {
      return "Controllers/Akai/AKAI APC64.pdf";
   }

   // MIDIOUT2 (APC64)
   // MIDIIN2 (APC64)
   @Override
   public void listAutoDetectionMidiPortNames(final AutoDetectionMidiPortNamesList list,
                                              final PlatformType platformType) {
      if (platformType == PlatformType.WINDOWS) {
         list.add(new String[]{"APC64", "MIDIIN2 (APC64)"}, new String[]{"APC64"});
      } else if (platformType == PlatformType.MAC) {
         list.add(new String[]{"APC64 DAW (APC64)", "APC64 Notes (APC64)"}, new String[]{"APC64 DAW (APC64)"});
      } else if (platformType == PlatformType.LINUX) {
         list.add(new String[]{"APC64 DAW (APC64)", "APC64 Notes (APC64)"}, new String[]{"APC64 DAW (APC64)"});
      }
   }

   @Override
   public Apc64Extension createInstance(final ControllerHost host) {
      return new Apc64Extension(this, host);
   }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/Apc64MidiProcessor.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.function.Consumer;
import java.util.function.IntConsumer;

import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extension.controller.api.MidiOut;
import com.bitwig.extension.controller.api.NoteInput;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.framework.time.TimedEvent;
import com.bitwig.extensions.framework.values.BooleanValueObject;

public class Apc64MidiProcessor implements MidiProcessor {
    private static final String MODE_CHANGE_MSG = "f0470053190001";
    
    private static final String DEVICE_VALUE = "f07e00060247530019010";
    
    //2F0 47 00 53 19 00 01 02 F7
    public static final String PRINT_TO_CLIP_HEAD = "f0470053200002";
    public static final String PRINT_TO_CLIP_TAIL = "f0470053220000f7";
    public static final String PRINT_TO_CLIP_BODY = "f047005321";
    private static final String TEXT_PREFIX = "F0 47 00 53 10 00 ";
    protected final MidiIn midiIn;
    protected final MidiOut midiOut;
    protected final NoteInput noteInput;
    protected final Queue<TimedEvent> timedEvents = new ConcurrentLinkedQueue<>();
    protected final ControllerHost host;
    protected List<Consumer<PadMode>> modeChangeListeners = new ArrayList<>();
    private final int[] noteState = new int[128];
    private final int[] noteValueState = new int[128];
    private HardwareElements hwElements;
    private final BooleanValueObject shiftMode;
    private final BooleanValueObject clearMode;
    private Consumer<PrintToClipSeq> printToClipSeqConsumer;
    private PrintToClipSeq currentPrintToClip;
    private boolean sessionModeState = false;
    private boolean initState = true;
    private PadMode currentMode = PadMode.SESSION;
    
    public Apc64MidiProcessor(final ControllerHost host, final MidiIn midiIn, final MidiOut midiOut,
        final ModifierStates modifierStates) {
        this.host = host;
        this.midiIn = midiIn;
        this.midiOut = midiOut;
        noteInput = midiIn.createNoteInput("MIDI", "86????", "96????", "A?????", "D?????");
        setupNoteInput();
        Arrays.fill(noteState, 0);
        Arrays.fill(noteValueState, 0);
        this.shiftMode = modifierStates.getShiftActive();
        this.clearMode = modifierStates.getClearActive();
        midiIn.setMidiCallback(this::handleMidiIn);
        midiIn.setSysexCallback(this::handleSysEx);
    }
    
    private void setupNoteInput() {
        noteInput.setShouldConsumeEvents(true);
        final Integer[] noAssignTable = new Integer[128];
        Arrays.fill(noAssignTable, Integer.valueOf(-1));
        noteInput.setKeyTranslationTable(noAssignTable);
    }
    
    @Override
    public NoteInput createNoteInput(final String name, final String... mask) {
        return midiIn.createNoteInput(name, mask);
    }
    
    @Override
    public void sendMidi(final int status, final int val1, final int val2) {
        midiOut.sendMidi(status, val1, val2);
        noteState[val1] = status & 0xF;
        noteValueState[val1] = val2;
    }
    
    public void setHwElements(final HardwareElements elements) {
        this.hwElements = elements;
    }
    
    public void restoreState() {
        if (hwElements == null) {
            return;
        }
        hwElements.invokeRefresh();
        //        for (int i = 0; i < noteState.length; i++) {
        //            if (noteState[i] != -1) {
        //                midiOut.sendMidi(0x90 | noteState[i], i, noteValueState[i]);
        //            }
        //        }
    }
    
    @Override
    public void start() {
        midiOut.sendSysex("F0 47 00 53 1B 00 01 00 F7");
        midiOut.sendSysex("F0 47 00 53 19 00 01 00 F7");
        midiOut.sendSysex("F0 7E 7F 06 01 F7");
        host.scheduleTask(this::handlePing, 50);
    }
    
    public NoteInput getNoteInput() {
        return noteInput;
    }
    
    public void setDrumMode(final boolean drumMode) {
        if (drumMode) {
            enterSessionMode();
            midiOut.sendSysex("F0 47 00 53 1B 00 01 01 F7");
            activateDawMode(true);
        } else {
            midiOut.sendSysex("F0 47 00 53 1B 00 01 00 F7");
            midiOut.sendSysex("F0 47 00 53 19 00 01 02 F7");
            exitSessionMode();
        }
    }
    
    
    public boolean isSessionModeState() {
        return sessionModeState;
    }
    
    public boolean modeHasTextControl() {
        return currentMode.hasLocalControl();
    }
    
    public void exitSessionMode() {
        if (sessionModeState) {
            activateDawMode(false);
            sessionModeState = false;
        }
    }
    
    public void enterSessionMode() {
        if (!sessionModeState) {
            activateDawMode(true);
            sessionModeState = true;
        }
    }
    
    public void activateDawMode(final boolean active) {
        midiOut.sendSysex("F0 47 00 53 1C 00 01 %02X F7".formatted(active ? 1 : 0));
    }
    
    private void handlePing() {
        if (!timedEvents.isEmpty()) {
            for (final TimedEvent event : timedEvents) {
                event.process();
                if (event.isCompleted()) {
                    timedEvents.remove(event);
                }
            }
        }
        host.scheduleTask(this::handlePing, 50);
    }
    
    public void queueEvent(final TimedEvent event) {
        timedEvents.add(event);
    }
    
    public MidiIn getMidiIn() {
        return midiIn;
    }
    
    public void setPrintToClipSeqConsumer(final Consumer<PrintToClipSeq> printToClipSeqConsumer) {
        this.printToClipSeqConsumer = printToClipSeqConsumer;
    }
    
    public void addModeChangeListener(final Consumer<PadMode> modeChangeListener) {
        this.modeChangeListeners.add(modeChangeListener);
    }
    
    @Override
    public void setModeChangeListener(final IntConsumer modeChangeListener) {
        // nothing to do
    }
    
    private void handleMidiIn(final int status, final int data1, final int data2) {
        //Apc64Extension.println("MIDI => %02X %02X %02X", status, data1, data2);
    }
    
    public BooleanValueObject getShiftMode() {
        return shiftMode;
    }
    
    public BooleanValueObject getClearMode() {
        return clearMode;
    }
    
    // Text  F0 47 00 53 10 00 0A 00 20 31 2D 4D 49 44 49 20 00 F7
    // 1-MIDI
    // Text  F0 47 00 53 10 00 0A 00 41 42 43 44 61 31 32 33 00 F7
    // ABCDa123
    // Confirmation F0 7E 00 06 02 47 53 00 19 01 01 00 0E 00 00 00 00 00 41 34 32 33 30 37 32 35 37 34 30 32 37 31
    // 31 00 F7
    
    protected void handleSysEx(final String sysExString) {
        //Apc64Extension.println("SysEx = %s  mode=%s", sysExString, sysExString.startsWith(MODE_CHANGE_MSG));
        if (sysExString.startsWith(DEVICE_VALUE)) {
            Apc64Extension.println("#### Connect to APC #### ");
            initState = false;
            enterSessionMode();
        } else if (sysExString.startsWith(MODE_CHANGE_MSG)) {
            final int mode =
                Integer.parseInt(sysExString.substring(MODE_CHANGE_MSG.length(), MODE_CHANGE_MSG.length() + 2), 16);
            handleModeChange(mode);
        } else if (sysExString.startsWith(PRINT_TO_CLIP_HEAD)) {
            final String value = sysExString.substring(PRINT_TO_CLIP_HEAD.length(), sysExString.length() - 2);
            final int length = fromHexValue(value);
            currentPrintToClip = new PrintToClipSeq(length);
        } else if (sysExString.startsWith(PRINT_TO_CLIP_BODY)) {
            final String data = sysExString.substring(PRINT_TO_CLIP_BODY.length() + 2, sysExString.length() - 4);
            final int headValue =
                fromHexValue(sysExString.substring(PRINT_TO_CLIP_BODY.length(), PRINT_TO_CLIP_BODY.length() + 2));
            currentPrintToClip.addNoteData(data);
            currentPrintToClip.setHeadValue(headValue);
        } else if (sysExString.startsWith(PRINT_TO_CLIP_TAIL)) {
            if (printToClipSeqConsumer != null) {
                printToClipSeqConsumer.accept(currentPrintToClip);
            }
        } else {
            //Apc64Extension.println("Unknown SysEx = %s", sysExString);
        }
    }
    
    private void handleModeChange(final int mode) {
        if (initState) {
            return;
        }
        currentMode = PadMode.fromId(mode);
        //Apc64Extension.println(" MODE =%d ==> %s", mode, currentMode);
        
        if (currentMode.hasLocalControl()) {
            //Apc64Extension.println(" DAW MODE IN %s", sessionModeState);
            activateDawMode(true);
            sessionModeState = true;
            restoreState();
        } else {
            exitSessionMode();
        }
        modeChangeListeners.forEach(listener -> listener.accept(currentMode));
    }
    
    private int fromHexValue(final String hex) {
        if (hex.length() == 4) {
            final int v1 = Integer.parseInt(hex.substring(0, 2), 16);
            final int v2 = Integer.parseInt(hex.substring(2, 4), 16);
            return (v1 << 7) | v2;
        }
        if (hex.length() < 3) {
            return Integer.parseInt(hex, 16);
        }
        return 0;
    }
    
    public void sendText(final int row, final String text) {
        final StringBuilder sb = new StringBuilder(TEXT_PREFIX);
        final int len = Math.min(14, Math.max(3, text.length()));
        sb.append("%02X ".formatted(len + 2));
        sb.append("%02X ".formatted(row));
        final String asciiText = StringUtil.toAsciiDisplay(text, len);
        for (int i = 0; i < len; i++) {
            if (i < asciiText.length()) {
                sb.append("%02X ".formatted((int) asciiText.charAt(i)));
            } else {
                sb.append("20 ");
            }
        }
        sb.append("00 ");
        sb.append("F7");
        //Apc64Extension.println(" SEND TEXT %d => %s", row, text);
        midiOut.sendSysex(sb.toString());
    }
    
    
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/ApcPreferences.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.Application;
import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.DocumentState;
import com.bitwig.extension.controller.api.Preferences;
import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extension.controller.api.SettableEnumValue;
import com.bitwig.extensions.controllers.akai.apc.common.OrientationFollowType;
import com.bitwig.extensions.controllers.akai.apc.common.PanelLayout;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.values.FocusMode;
import com.bitwig.extensions.framework.values.ValueObject;

@Component
public class ApcPreferences {
    
    private final ValueObject<OrientationFollowType> orientationFollow;
    private final ValueObject<PanelLayout> panelLayout = new ValueObject<>(PanelLayout.VERTICAL);
    private final SettableBooleanValue altModeWithShift;
    private final SettableEnumValue recordButtonAssignment;
    private final SettableEnumValue gridLayoutSettings;
    private PanelLayout bitwigPanelLayout;
    private FocusMode recordFocusMode = FocusMode.LAUNCHER;
    
    public ApcPreferences(final ControllerHost host, final Application application) {
        final Preferences preferences = host.getPreferences(); // THIS
        orientationFollow = new ValueObject<>(OrientationFollowType.AUTOMATIC);
        gridLayoutSettings = preferences.getEnumSetting("Orientation determined by", "Grid Layout", new String[] {
                OrientationFollowType.AUTOMATIC.getLabel(), //
                OrientationFollowType.FIXED_VERTICAL.getLabel(), //
                OrientationFollowType.FIXED_HORIZONTAL.getLabel()
            }, //
            OrientationFollowType.FIXED_VERTICAL.getLabel());
        gridLayoutSettings.addValueObserver(newValue -> orientationFollow.set(OrientationFollowType.toType(newValue)));
        application.panelLayout().addValueObserver(this::handlePanelLayoutChanged);
        altModeWithShift = preferences.getBooleanSetting("Use as ALT trigger modifier", "Shift Button", true);
        altModeWithShift.markInterested();
        orientationFollow.addValueObserver((newValue -> {
            determinePanelLayout(orientationFollow.get());
        }));
        final DocumentState documentState = host.getDocumentState(); // THIS
        recordButtonAssignment = documentState.getEnumSetting("Record Button assignment", //
            "Transport", new String[] {FocusMode.LAUNCHER.getDescriptor(), FocusMode.ARRANGER.getDescriptor()},
            recordFocusMode.getDescriptor());
        recordButtonAssignment.addValueObserver(value -> {
            recordFocusMode = FocusMode.toMode(value);
        });
    }
    
    private void handlePanelLayoutChanged(final String layout) {
        if (layout.equals("MIX")) {
            bitwigPanelLayout = PanelLayout.VERTICAL;
        } else if (layout.equals("ARRANGE")) {
            bitwigPanelLayout = PanelLayout.HORIZONTAL;
        } else {
            bitwigPanelLayout = PanelLayout.VERTICAL;
        }
        determinePanelLayout(orientationFollow.get());
    }
    
    public SettableEnumValue getGridLayoutSettings() {
        return gridLayoutSettings;
    }
    
    public SettableBooleanValue getAltModeWithShift() {
        return altModeWithShift;
    }
    
    public boolean useShiftForAltMode() {
        return altModeWithShift.get();
    }
    
    public FocusMode getRecordFocusMode() {
        return recordFocusMode;
    }
    
    public ValueObject<PanelLayout> getPanelLayout() {
        return panelLayout;
    }
    
    private void determinePanelLayout(final OrientationFollowType followType) {
        if (followType == OrientationFollowType.FIXED_VERTICAL) {
            panelLayout.set(PanelLayout.VERTICAL);
        } else if (followType == OrientationFollowType.FIXED_HORIZONTAL) {
            panelLayout.set(PanelLayout.HORIZONTAL);
        } else {
            panelLayout.set(bitwigPanelLayout);
        }
    }
    
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/DeviceControl.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.framework.values.BasicStringValue;
import com.bitwig.extensions.framework.values.IntValueObject;

import java.util.function.Consumer;

public class DeviceControl {
    private final CursorRemoteControlsPage deviceRemotePages;
    private final CursorRemoteControlsPage trackRemotes;
    private final CursorRemoteControlsPage projectRemotes;
    private final PinnableCursorDevice cursorDevice;
    private final PinnableCursorDevice primaryDevice;
    private final DrumPadBank drumPadBank;
    private Focus currentFocus = Focus.DEVICE;
    private final BasicStringValue deviceName = new BasicStringValue("");
    private final BasicStringValue pageName = new BasicStringValue("");
    private String[] devicePageNames = new String[]{};
    private String deviceRawName = "";
    private int devicePageIndex = 0;
    private String[] trackRemotePageNames = new String[]{};
    private int trackRemotePageIndex = 0;
    private String[] projectRemotePageNames = new String[]{};
    private int projectRemotePageIndex = 0;
    private Consumer<Focus> focusListener = null;
    private String padRawName = "";
    private final IntValueObject selectedPadIndex = new IntValueObject(-1, -1, 15);

    public enum Focus {
        DEVICE,
        TRACK,
        PROJECT
    }

    public DeviceControl(final CursorTrack cursorTrack, final Track rootTrack) {
        cursorDevice = cursorTrack.createCursorDevice();
        cursorDevice.hasDrumPads().markInterested();
        cursorDevice.name().addValueObserver(name -> {
            deviceRawName = name.isBlank() ? "<No Device>" : name;
            if (currentFocus == Focus.DEVICE) {
                deviceName.set(deviceRawName);
            }
        });
        cursorDevice.hasNext().markInterested();
        cursorDevice.hasPrevious().markInterested();
        cursorDevice.hasLayers().markInterested();
        cursorDevice.hasSlots().markInterested();
        cursorDevice.slotNames().markInterested();

        deviceRemotePages = cursorDevice.createCursorRemoteControlsPage(8);
        deviceRemotePages.pageNames().addValueObserver(names -> {
            devicePageNames = names;
            applyCurrentValues(Focus.DEVICE);
        });
        deviceRemotePages.selectedPageIndex().addValueObserver(index -> {
            devicePageIndex = index;
            applyCurrentValues(Focus.DEVICE);
        });
        deviceRemotePages.setHardwareLayout(HardwareControlType.SLIDER, 8);
        primaryDevice = cursorTrack.createCursorDevice("drumdetection", "Pad Device", 8,
                CursorDeviceFollowMode.FIRST_INSTRUMENT);
        primaryDevice.hasDrumPads().markInterested();
        primaryDevice.exists().markInterested();

        trackRemotes = cursorTrack.createCursorRemoteControlsPage("track-remotes", 8, null);
        trackRemotes.setHardwareLayout(HardwareControlType.SLIDER, 8);
        trackRemotes.pageNames().addValueObserver(names -> {
            trackRemotePageNames = names;
            applyCurrentValues(Focus.TRACK);
        });
        trackRemotes.selectedPageIndex().addValueObserver(index -> {
            trackRemotePageIndex = index;
            applyCurrentValues(Focus.TRACK);
        });

        projectRemotes = rootTrack.createCursorRemoteControlsPage("project-remotes", 8, null);
        projectRemotes.setHardwareLayout(HardwareControlType.SLIDER, 8);
        projectRemotes.pageNames().addValueObserver(names -> {
            projectRemotePageNames = names;
            applyCurrentValues(Focus.PROJECT);
        });
        projectRemotes.selectedPageIndex().addValueObserver(index -> {
            projectRemotePageIndex = index;
            applyCurrentValues(Focus.PROJECT);
        });
        drumPadBank = primaryDevice.createDrumPadBank(16);
        for (int i = 0; i < 16; i++) {
            final int index = i;
            final DrumPad pad = drumPadBank.getItemAt(i);
            pad.name().addValueObserver(name -> handlePadNameChanged(index, name));
            pad.addIsSelectedInEditorObserver(selected -> handlePadSelection(selected, index, pad));
        }

        initRemotesPage(deviceRemotePages);
        initRemotesPage(trackRemotes);
        initRemotesPage(projectRemotes);
    }

    private void handlePadNameChanged(final int index, final String name) {
        if (index == selectedPadIndex.get()) {
            padRawName = name;
            if (cursorDevice.hasDrumPads().get()) {
                pageName.set(padRawName);
            }
        }
    }

    private void handlePadSelection(final boolean selected, final int index, final DrumPad pad) {
        if (selected) {
            selectedPadIndex.set(index);
            padRawName = pad.name().get();
            if (cursorDevice.hasDrumPads().get()) {
                pageName.set(padRawName);
            }
        }
    }

    public void setCurrentFocus(final Focus focus) {
        if (this.currentFocus != focus) {
            this.currentFocus = focus;
            applyCurrentValues(focus);
            if (this.focusListener != null) {
                this.focusListener.accept(this.currentFocus);
            }
        }
    }

    public PinnableCursorDevice getPrimaryDevice() {
        return primaryDevice;
    }

    public PinnableCursorDevice getCursorDevice() {
        return cursorDevice;
    }

    public void setFocusListener(final Consumer<Focus> focusListener) {
        this.focusListener = focusListener;
    }

    private void applyCurrentValues(final Focus focus) {
        if (focus != this.currentFocus) {
            return;
        }
        if (this.currentFocus == Focus.DEVICE) {
            deviceName.set(deviceRawName);
            if (devicePageIndex >= 0 && devicePageIndex < devicePageNames.length) {
                pageName.set(devicePageNames[devicePageIndex]);
            } else {
                pageName.set("<No Remotes>");
            }
        } else if (this.currentFocus == Focus.TRACK) {
            deviceName.set("Track Remotes");
            if (trackRemotePageIndex >= 0 && trackRemotePageIndex < trackRemotePageNames.length) {
                pageName.set(trackRemotePageNames[trackRemotePageIndex]);
            } else {
                pageName.set("<No Remotes>");
            }
        } else if (this.currentFocus == Focus.PROJECT) {
            deviceName.set("Project Remotes");
            if (projectRemotePageIndex >= 0 && projectRemotePageIndex < projectRemotePageNames.length) {
                pageName.set(projectRemotePageNames[projectRemotePageIndex]);
            } else {
                pageName.set("<No Remotes>");
            }
        }
        if (cursorDevice.hasDrumPads().get()) {
            pageName.set(padRawName);
        }
    }

    public BasicStringValue getDeviceName() {
        return deviceName;
    }

    public BasicStringValue getPageName() {
        return pageName;
    }

    public void selectDevice(final int dir) {
        switch (currentFocus) {
            case DEVICE -> navigateDevice(dir);
            case TRACK -> navigateTrack(dir);
            case PROJECT -> navigateProject(dir);
        }
    }

    private void navigateTrack(final int dir) {
        if (dir > 0) {
            setCurrentFocus(Focus.DEVICE);
        } else {
            setCurrentFocus(Focus.PROJECT);
        }
    }

    private void navigateProject(final int dir) {
        if (dir > 0) {
            setCurrentFocus(Focus.TRACK);
        }
    }

    public void navigateDevice(final int dir) {
        if (dir > 0) {
            cursorDevice.selectNext();
        } else if (cursorDevice.hasPrevious().get()) {
            cursorDevice.selectPrevious();
        } else {
            setCurrentFocus(Focus.TRACK);
        }
    }

    public boolean canScrollDevices(final int dir) {
        return switch (currentFocus) {
            case DEVICE -> dir <= 0 || cursorDevice.hasNext().get();
            case TRACK -> true;
            case PROJECT -> dir > 0;
        };
    }

    public void selectParameterPage(final int dir) {
        if (dir > 0) {
            getCurrentPage().selectNext();
        } else {
            getCurrentPage().selectPrevious();
        }
    }

    public CursorRemoteControlsPage getCurrentPage() {
        return getPage(currentFocus);
    }

    public CursorRemoteControlsPage getPage(final Focus focus) {
        return switch (focus) {
            case TRACK -> trackRemotes;
            case DEVICE -> deviceRemotePages;
            case PROJECT -> projectRemotes;
        };
    }

    public DrumPadBank getDrumPadBank() {
        return drumPadBank;
    }

    public boolean canScrollParameterPages(final int dir) {
        if (dir > 0) {
            return getCurrentPage().hasNext().get();
        }
        return getCurrentPage().hasPrevious().get();
    }

    public boolean canNavigateIntoDevice(final int dir) {
        if (dir > 0) {
            return cursorDevice.hasLayers().get() || cursorDevice.hasDrumPads().get() || cursorDevice.hasSlots().get();
        }
        return true;
    }

    public void navigateVertical(final int dir) {
        if (dir > 0) {
            if (cursorDevice.hasDrumPads().get()) {
                cursorDevice.selectFirstInKeyPad(36); // to do get from pad
            } else if (cursorDevice.hasLayers().get()) {
                cursorDevice.selectFirstInLayer(0);
            } else if (cursorDevice.hasSlots().get()) {
                final String[] slotNames = cursorDevice.slotNames().get();
                cursorDevice.selectFirstInSlot(slotNames[0]);
            }
        } else {
            cursorDevice.selectParent();
        }
    }

    private void initRemotesPage(final CursorRemoteControlsPage remotesPage) {
        remotesPage.hasPrevious().markInterested();
        remotesPage.hasNext().markInterested();
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/FocusClip.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.di.Inject;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;

@Component
public class FocusClip {
    private static final int SINGLE_SLOT_RANGE = 8;

    private final CursorTrack cursorTrack;
    private final Application application;
    private final Transport transport;
    private final Clip mainCursorClip;
    private final Project project;
    private final ControllerHost host;
    private final OverviewGrid overviewGrid;

    private int selectedSlotIndex = -1;
    private int scrollOffset = 0;

    private String currentTrackName = "";

    private final Map<String, Integer> indexMemory = new HashMap<>();
    private final ClipLauncherSlotBank slotBank;
    private ClipLauncherSlot focusSlot;
    private Runnable scrollTask = null;

    @Inject
    private MidiProcessor midiProcessor;

    public FocusClip(ControllerHost host, Application application, Transport transport, ViewControl viewControl,
                     Project project) {
        this.cursorTrack = viewControl.getCursorTrack();
        this.project = project;
        this.host = host;
        this.overviewGrid = viewControl.getOverviewGrid();
        slotBank = cursorTrack.clipLauncherSlotBank();
        for (int i = 0; i < slotBank.getSizeOfBank(); i++) {
            final ClipLauncherSlot slot = slotBank.getItemAt(i);
            slot.exists().markInterested();
            slot.isRecording().markInterested();
            slot.isPlaying().markInterested();
            slot.hasContent().markInterested();
        }

        this.application = application;
        this.transport = transport;

        slotBank.addPlaybackStateObserver((slotIndex, playbackState, isQueued) -> {
            if (playbackState != 0 && !isQueued) {
                slotBank.select(slotIndex);
            }
        });
        slotBank.addIsSelectedObserver((index, selected) -> {
            if (selected) {
                selectedSlotIndex = index;
                indexMemory.put(currentTrackName, selectedSlotIndex);
                focusSlot = slotBank.getItemAt(selectedSlotIndex);
            }
        });
        slotBank.scrollPosition().addValueObserver(scrollPos -> {
            //Apc64Extension.println(" SB %d %d", scrollPos, overviewGrid.getNumberOfScenes());
            scrollOffset = scrollPos;
            if (scrollTask != null) {
                scrollTask.run();
                scrollTask = null;
            }
        });

        this.cursorTrack.name().addValueObserver(name -> {
            selectedSlotIndex = -1;
            currentTrackName = name;
            final Integer index = indexMemory.get(name);
            if (index != null) {
                selectedSlotIndex = index.intValue();
            }
        });
        mainCursorClip = viewControl.getCursorClip();
    }

    public void invokeRecord() {
        if (selectedSlotIndex != -1) {
            final ClipLauncherSlot slot = slotBank.getItemAt(selectedSlotIndex);
            if (slot.isRecording().get()) {
                slot.launch();
                transport.isClipLauncherOverdubEnabled().set(false);
            } else {
                Optional<ClipLauncherSlot> emptySlot = getFirstEmptySlot(selectedSlotIndex);
                if (emptySlot.isPresent()) {
                    recordAction(emptySlot.get());
                } else {
                    project.createScene();
                    host.scheduleTask(
                            () -> getFirstEmptySlot(selectedSlotIndex).ifPresent(newSlot -> recordAction(newSlot)), 50);
                }
            }
        } else {
            getFirstEmptySlot(selectedSlotIndex).ifPresent(slot -> recordAction(slot));
        }
    }

    private void recordAction(ClipLauncherSlot emptySlot) {
        emptySlot.launch();
        transport.isClipLauncherOverdubEnabled().set(true);
    }

    public void duplicateContent() {
        mainCursorClip.duplicateContent();
    }

    public void quantize(final double amount) {
        mainCursorClip.quantize(amount);
    }

    public void clearSteps() {
        mainCursorClip.clearSteps();
    }

    public void transpose(final int semitones) {
        mainCursorClip.transpose(semitones);
    }

    public void focusOnNextEmpty(Consumer<ClipLauncherSlot> postCreation) {
        if (focusSlotIsEmpty()) {
            postCreation.accept(focusSlot);
        } else {
            getFirstEmptySlot(selectedSlotIndex) //
                    .ifPresentOrElse(slot -> postCreation.accept(slot),  //
                            () -> ensureEmptySlot(postCreation));
        }
    }

    private void ensureEmptySlot(Consumer<ClipLauncherSlot> postCreation) {
        project.createScene();
        host.scheduleTask(() -> getFirstEmptySlot(selectedSlotIndex).ifPresent(newSlot -> postCreation.accept(newSlot)),
                50);
    }

    private boolean focusSlotIsEmpty() {
        return focusSlot != null && !focusSlot.hasContent().get() && focusSlot.exists().get();
    }

    private Optional<ClipLauncherSlot> getFirstEmptySlot(int startIndex) {
        int start = startIndex < 0 ? 0 : startIndex;
        for (int i = start; i < slotBank.getSizeOfBank(); i++) {
            final ClipLauncherSlot slot = slotBank.getItemAt(i);
            if (!slot.hasContent().get() && slot.exists().get()) {
                return Optional.of(slot);
            }
        }
        return Optional.empty();
    }

    public void clearNotes(int noteToClear) {
        mainCursorClip.clearStepsAtY(0, noteToClear);
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/HardwareElements.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extensions.controllers.akai.apc.common.control.ClickEncoder;
import com.bitwig.extensions.controllers.akai.apc.common.control.RgbButton;
import com.bitwig.extensions.controllers.akai.apc64.control.OledBacklight;
import com.bitwig.extensions.controllers.akai.apc64.control.SingleLedButton;
import com.bitwig.extensions.controllers.akai.apc64.control.TouchSlider;
import com.bitwig.extensions.framework.di.Component;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class HardwareElements {
    private RgbButton[][] buttons;
    private RgbButton[][] drumButtons;
    private SingleLedButton[] sceneButtons;
    private TouchSlider[] sliders = new TouchSlider[8];
    private final RgbButton[] trackButtons = new RgbButton[8];
    private final RgbButton[] trackControlButtons = new RgbButton[8];
    private final ClickEncoder mainEncoder;
    private final SingleLedButton encoderPress;
    private final Map<Apc64CcAssignments, SingleLedButton> mainButtons;
    private final OledBacklight oledBackLight;

    public HardwareElements(ControllerHost host, HardwareSurface surface, Apc64MidiProcessor midiProcessor) {
        MidiIn midiIn = midiProcessor.getMidiIn();
        final int numberOfScenes = 8;
        drumButtons = new RgbButton[numberOfScenes][8];
        int noteNr = Apc64CcAssignments.GRID_BASE.getStateId();
        buttons = new RgbButton[numberOfScenes][8];
        sceneButtons = new SingleLedButton[numberOfScenes];
        for (int row = 0; row < numberOfScenes; row++) {
            for (int col = 0; col < 8; col++) {
                buttons[row][col] = new RgbButton(6, noteNr++, "PAD", surface, midiProcessor);
            }
            sceneButtons[row] = new SingleLedButton(Apc64CcAssignments.SCENE_BUTTON_BASE.getStateId() + row, "SCENE",
                    surface, midiProcessor);
        }
        mainEncoder = new ClickEncoder(0x5A, host, surface, midiIn);
        encoderPress = new SingleLedButton(0x5A, "ENCODER_PRESS", surface, midiProcessor);
        oledBackLight = new OledBacklight(surface, midiProcessor, 0x59);

        mainButtons = Arrays.stream(Apc64CcAssignments.values()) //
                .filter(Apc64CcAssignments::isSingle) //
                .collect(Collectors.toMap(assignment -> assignment,//
                        assignment -> new SingleLedButton(assignment.getStateId(), assignment.toString(), surface,
                                midiProcessor)));

        for (int i = 0; i < 8; i++) {
            sliders[i] = new TouchSlider(i, surface, midiProcessor);
            trackButtons[i] = new RgbButton(0, Apc64CcAssignments.TRACKS_BASE.getStateId() + i, "TRACK_SEL", surface,
                    midiProcessor);
            trackControlButtons[i] = new RgbButton(0, Apc64CcAssignments.TRACK_CONTROL_BASE.getStateId() + i,
                    "TRACK_CTL", surface, midiProcessor);
        }
    }

    public void invokeRefresh() {
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                buttons[i][j].refresh();
            }
        }
    }

    public SingleLedButton getSceneButton(int index) {
        return sceneButtons[index];
    }

    public OledBacklight getOledBackLight() {
        return oledBackLight;
    }

    public SingleLedButton getButton(Apc64CcAssignments assignment) {
        return mainButtons.get(assignment);
    }

    public ClickEncoder getMainEncoder() {
        return mainEncoder;
    }

    public SingleLedButton getEncoderPress() {
        return encoderPress;
    }

    public RgbButton getTrackSelectButton(int index) {
        return trackButtons[index];
    }

    public RgbButton getTrackControlButtons(int index) {
        return trackControlButtons[index];
    }

    public RgbButton getGridButton(final int sceneIndex, final int trackIndex) {
        return buttons[buttons.length - sceneIndex - 1][trackIndex];
    }

    public RgbButton getDrumButton(final int sceneIndex, final int trackIndex) {
        return drumButtons[buttons.length - sceneIndex - 1][trackIndex];
    }

    public TouchSlider[] getTouchSliders() {
        return sliders;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/Menu.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extension.controller.api.SettableEnumValue;
import com.bitwig.extensions.controllers.akai.apc64.layer.MainDisplay;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class Menu {
    private final MainDisplay.Screen screen;
    private final List<MenuItem> items = new ArrayList<>();
    private int itemIndex = 0;
    private boolean onMenu = true;
    private MenuItem currentMenu;

    public record EnumMenuValue(String value, String displayValue) {

    }

    public abstract static class MenuItem {
        private final String name;
        protected Consumer<String> updater;

        protected MenuItem(final String name) {
            this.name = name;
        }

        public void setFocusScreen(final Consumer<String> updater) {
            this.updater = updater;
        }

        public void release() {
            this.updater = null;
        }

        public void update(final String newValue) {
            if (updater != null) {
                updater.accept(newValue);
            }
        }

        public abstract String getCurrentValue();

        public abstract void handleIncrement(final int dir);

        public boolean isMomentary() {
            return false;
        }

        public void handlePressed(final boolean pressed) {
        }
    }

    public static class EnumMenuItem extends MenuItem {
        private final SettableEnumValue value;
        private final List<EnumMenuValue> selection;
        private EnumMenuValue current;

        public EnumMenuItem(final String name, final SettableEnumValue value, final List<EnumMenuValue> selection) {
            super(name);
            value.markInterested();
            this.value = value;
            this.selection = selection;
            this.current = selection.get(0);
            value.addValueObserver(enumValue -> this.update(enumValue));
        }

        public void update(final String newValue) {
            current = selection.stream().filter(v -> v.value.equals(newValue)).findFirst().orElse(null);
            if (updater != null) {
                updater.accept(current.displayValue());
            }
        }

        @Override
        public String getCurrentValue() {
            return current.displayValue();
        }

        public void handleIncrement(final int dir) {
            current = nextValue(value.get(), selection, dir, false);
            value.set(current.value());
        }

    }

    public static class BooleanToggleMenuItem extends MenuItem {
        private final SettableBooleanValue value;

        public BooleanToggleMenuItem(final String name, final SettableBooleanValue value) {
            super(name);
            this.value = value;
            value.addValueObserver(boolValue -> this.update(boolValue ? "On" : "Off"));
        }

        public void handlePressed(final boolean pressed) {
            if (pressed) {
                value.toggle();
            }
        }

        @Override
        public boolean isMomentary() {
            return true;
        }

        @Override
        public String getCurrentValue() {
            return value.get() ? "On" : "Off";
        }

        public void handleIncrement(final int dir) {
            value.toggle();
        }

    }

    public static class HoldMenuItem extends MenuItem {
        private final SettableBooleanValue value;

        public HoldMenuItem(final String name, final SettableBooleanValue value) {
            super(name);
            this.value = value;
            value.addValueObserver(boolValue -> this.update(boolValue ? "On" : "Off"));
        }

        @Override
        public String getCurrentValue() {
            return value.get() ? "On" : "Off";
        }

        @Override
        public void handleIncrement(final int dir) {
        }

        @Override
        public void handlePressed(final boolean pressed) {
            value.set(pressed);
        }

        public boolean isMomentary() {
            return true;
        }
    }

    public Menu(final MainDisplay.Screen screen) {
        this.screen = screen;
        screen.setRow(0, "Bitwig Menu");
    }

    public void addMenuItem(final MenuItem item) {
        this.items.add(item);
    }

    public void init() {
        if (this.items.isEmpty()) {
            return;
        }
        currentMenu = this.items.get(0);
        currentMenu.setFocusScreen(this::updateValue);
        update();
    }

    private void update() {
        final MenuItem menuItem = items.get(itemIndex);
        screen.setRow(1, "%s %s ".formatted(onMenu ? ">" : " ", menuItem.name));
        updateValue(menuItem.getCurrentValue());
    }

    public void handleInc(final int dir) {
        if (onMenu) {
            final int nextIndex = itemIndex + dir;
            if (nextIndex >= 0 && nextIndex < items.size()) {
                items.get(itemIndex).release();
                itemIndex = nextIndex;
                items.get(itemIndex).setFocusScreen(this::updateValue);
                currentMenu = this.items.get(itemIndex);
                update();
            }
        } else {
            final MenuItem menuItem = items.get(itemIndex);
            menuItem.handleIncrement(dir);
            update();
        }
    }

    private void updateValue(final String value) {
        screen.setRow(2, "%s%s ".formatted(!onMenu ? ">" : "", value));
    }

    public void handEncoderClick(final boolean pressed) {
        Apc64Extension.println(" ON menu %s %s", currentMenu.getClass().getName(), onMenu);
        if (currentMenu.isMomentary()) {
            onMenu = true;
            currentMenu.handlePressed(pressed);
            update();
        } else {
            if (pressed) {
                onMenu = !onMenu;
                update();
            }
        }
    }

    public static EnumMenuValue nextValue(final String currentValue, final List<EnumMenuValue> list, final int inc,
                                          final boolean wrap) {
        int index = -1;
        final int size = list.size();
        for (int i = 0; i < size; i++) {
            if (currentValue.equals(list.get(i).value())) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            final int next = index + inc;
            if (next >= 0 && next < size) {
                return list.get(next);
            } else if (wrap) {
                index = next < 0 ? size - 1 : next >= size ? 0 : next;
            }
            return list.get(index);
        }
        return list.get(0);
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/ModifierStates.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.values.BooleanValueObject;

@Component
public class ModifierStates {

    public static final int MSK_SHIFT = 0x1;
    public static final int MSK_CLEAR = 0x2;

    private final BooleanValueObject shiftActive = new BooleanValueObject();
    private final BooleanValueObject clearActive = new BooleanValueObject();
    private final BooleanValueObject duplicateActive = new BooleanValueObject();
    private final SettableBooleanValue quantizeActive = new BooleanValueObject();
    private final BooleanValueObject altActive = new BooleanValueObject();

    private int modifierMask = 0;

    public ModifierStates(final ControllerHost host) {
        shiftActive.addValueObserver(active -> setMask(MSK_SHIFT, active));
        clearActive.addValueObserver(active -> setMask(MSK_CLEAR, active));
    }

    private void setMask(final int mask, final boolean value) {
        if (value) {
            modifierMask |= mask;
        } else {
            modifierMask &= ~mask;
        }
    }

    public void setShift(final boolean active) {
        shiftActive.set(active);
    }

    public void setClear(final boolean active) {
        clearActive.set(active);
    }

    public BooleanValueObject getShiftActive() {
        return shiftActive;
    }

    public BooleanValueObject getClearActive() {
        return clearActive;
    }

    public boolean isShift() {
        return shiftActive.get();
    }

    public boolean isClear() {
        return clearActive.get();
    }

    public boolean anyModifierHeld() {
        return modifierMask > 0;
    }

    public boolean noModifier() {
        return modifierMask == 0;
    }

    public boolean onlyShift() {
        return modifierMask == MSK_SHIFT;
    }

    public void setDuplicate(final boolean active) {
        duplicateActive.set(active);
    }

    public boolean isDuplicate() {
        return duplicateActive.get();
    }

    public SettableBooleanValue getQuantizeActive() {
        return quantizeActive;
    }

    public BooleanValueObject getAltActive() {
        return altActive;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/OverviewGrid.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

public class OverviewGrid {

    private int sceneOffset;
    private int trackOffset;
    private int numberOfScenes;
    private int numberOfTracks;

    private int trackPosition;
    private int scenePosition;

    private final int[][] hasClips = new int[8][8];
    private final int[] sceneQueuedClips = new int[64];

    public int getNumberOfScenes() {
        return numberOfScenes;
    }

    public void setNumberOfScenes(final int numberOfScenes) {
        this.numberOfScenes = numberOfScenes;
    }

    public int getNumberOfTracks() {
        return numberOfTracks;
    }

    public void setNumberOfTracks(final int numberOfTracks) {
        this.numberOfTracks = numberOfTracks;
    }

    public int getTrackPosition() {
        return trackPosition - trackOffset;
    }

    public int getTrackOffset() {
        return trackOffset;
    }

    public void setTrackPosition(final int trackPosition) {
        this.trackPosition = trackPosition;
        this.trackOffset = (trackPosition / 64) * 64;
    }

    public int getScenePosition() {
        return scenePosition - sceneOffset;
    }

    public void setScenePosition(final int scenePosition) {
        this.scenePosition = scenePosition;
        this.sceneOffset = (scenePosition / 64) * 64;
    }

    public int getSceneOffset() {
        return sceneOffset;
    }

    public void markSceneQueued(int sceneIndex, boolean isQueued) {
        if (isQueued) {
            sceneQueuedClips[sceneIndex]++;
        } else if (sceneQueuedClips[sceneIndex] > 0) {
            sceneQueuedClips[sceneIndex]--;
        }
    }

    public void setHasClips(int trackIndex, int sceneIndex, boolean hasClip) {
        int gridScene = (sceneIndex) / 8;
        int gridTrack = (trackIndex) / 8;
        if (hasClip) {
            this.hasClips[gridTrack][gridScene]++;
        } else if (this.hasClips[gridTrack][gridScene] > 0) {
            this.hasClips[gridTrack][gridScene]--;
        }
    }

    public boolean hasClips(int trackIndex, int sceneIndex) {
        return this.hasClips[trackIndex][sceneIndex] > 0;
    }

    public boolean hasQueuedScenes(int sceneIndex) {
        int index = sceneIndex - sceneOffset;
        if (index > 63) {
            return false;
        }
        return this.sceneQueuedClips[sceneIndex - sceneOffset] > 0;
    }

    public boolean inGrid(int trackIndex, int sceneIndex) {
        final int posX = trackIndex * 8;
        final int posY = sceneIndex * 8;
        return posX < (numberOfTracks - trackOffset) && posY < (numberOfScenes - sceneOffset);
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/PadMode.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import java.util.Arrays;

public enum PadMode {
    SESSION(0, true, false),
    OVERVIEW(1, true, false),
    NOTE(2, false, true),
    CHORD(3),
    CHORD_SETTINGS(4),
    DRUM(5, true, true),
    STEP_SEQUENCER(6),
    STEP_SEQUENCER_SETTINGS(7),
    PROJECT(8),
    CUSTOM(9),
    CUSTOM_SETTINGS(10),
    UNKNOWN(-1);

    private final int modeId;
    private final boolean hasLocalControl;
    private final boolean isKeyRelated;

    PadMode(int modeId, boolean hasLocalControl, boolean isKeyRelated) {
        this.modeId = modeId;
        this.hasLocalControl = hasLocalControl;
        this.isKeyRelated = isKeyRelated;
    }

    PadMode(int modeId) {
        this(modeId, false, false);
    }

    public int getModeId() {
        return modeId;
    }

    public static PadMode fromId(int id) {
        return Arrays.stream(PadMode.values()).filter(mode -> mode.getModeId() == id).findFirst().orElse(UNKNOWN);
    }

    public boolean hasLocalControl() {
        return hasLocalControl;
    }

    public boolean isKeyRelated() {
        return isKeyRelated;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/PrintToClipSeq.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.Clip;

import java.util.ArrayList;
import java.util.List;

public class PrintToClipSeq {
    public static final double PPQ_RESOLUTION = 96.0;
    private static int[] STEP_DIVISOR = {96, 64, 48, 32, 24, 16, 12, 8};
    private static final double[] RESOLUTIONS = {1.0, 0.666666, 0.5, 0.33333, 0.25, 0.1666666, 0.125, 0.0833333};

    private List<StepNote> notes = new ArrayList<>();
    private int length;
    private int headValue;

    public record StepNote(int start, int end, int note, int vel, int block, int tail) {
        public StepNote(String sysEx) {
            this(fromHexValueMask(sysEx, 1), fromHexValueMask(sysEx, 5), fromHexValue(sysEx, 3), fromHexValue(sysEx, 4),
                    fromHexValue(sysEx, 0), fromHexValue(sysEx, 7));
        }
    }

    public PrintToClipSeq(int length) {
        this.length = length;
    }

    public void setNotes(List<StepNote> notes) {
        this.notes = notes;
    }

    public void setHeadValue(int headValue) {
        this.headValue = headValue;
    }

    public int getLength() {
        return length;
    }

    public int getHeadValue() {
        return headValue;
    }

    public double getClipLen() {
        return (double) length / PPQ_RESOLUTION;
    }

    private static int fromHexValue(String overall, int offset) {
        return Integer.parseInt(overall.substring(offset * 2, offset * 2 + 2), 16);
    }

    public boolean hasNotes() {
        return !notes.isEmpty();
    }

    private static int fromHexValueMask(String overall, int offset) {
        String hex = overall.substring(offset * 2, offset * 2 + 4);
        int v1 = Integer.parseInt(hex.substring(0, 2), 16);
        int v2 = Integer.parseInt(hex.substring(2, 4), 16);
        return ((v1 & 0x3F) << 7) | v2;
    }

    public void addNoteData(String data) {
        int nrOfNotes = data.length() / 16;
        for (int i = 0; i < nrOfNotes; i++) {
            int offset = i * 16;
            String noteData = data.substring(offset, offset + 16);
            notes.add(new StepNote(noteData));
        }
    }

    public int getFittingIndex(int position) {
        for (int i = 0; i < STEP_DIVISOR.length; i++) {
            if (position % STEP_DIVISOR[i] == 0) {
                return i;
            }
        }
        return -1;
    }

    private int calculateResolutionIndex() {
        int res = 0;
        for (StepNote note : notes) {
            res = Math.max(res, getFittingIndex(note.start));
        }
        return res;
    }

    public void applyToClip(final Clip clip, int count) {
        double clipLen = getClipLen();
        clip.getPlayStop().set(clipLen);
        clip.getLoopLength().set(clipLen);
        clip.setName(String.format("SEQ APC %d".formatted(count)));
        final int resIndex = calculateResolutionIndex();
        clip.setStepSize(RESOLUTIONS[resIndex]);
        for (StepNote note : notes) {
            int x = note.start / STEP_DIVISOR[resIndex];
            int y = note.note;
            double len = (note.end - note.start) / PPQ_RESOLUTION;
            clip.setStep(x, y, note.vel, len);
        }
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/StringUtil.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

public class StringUtil {
    private static final char[] SPECIALS = {'ä', 'ü', 'ö', 'Ä', 'Ü', 'Ö', 'ß', 'é', 'è', 'ê', 'â', 'á', 'à', //
            'û', 'ú', 'ù', 'ô', 'ó', 'ò'};
    private static final String[] REPLACE = {"a", "u", "o", "A", "U", "O", "ss", "e", "e", "e", "a", "a", "a", //
            "u", "u", "u", "o", "o", "o"};

    public static String nextValue(final String currentValue, final String[] list, final int inc, final boolean wrap) {
        int index = -1;
        for (int i = 0; i < list.length; i++) {
            if (currentValue.equals(list[i])) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            final int next = index + inc;
            if (next >= 0 && next < list.length) {
                return list[next];
            } else if (wrap) {
                index = next < 0 ? list.length - 1 : next >= list.length ? 0 : next;
            }
            return list[index];
        }
        return list[0];
    }

    public static String toAsciiDisplay(final String name, final int maxLen) {
        final StringBuilder b = new StringBuilder();
        for (int i = 0; i < name.length() && b.length() < maxLen; i++) {
            final char c = name.charAt(i);
//            if (c == 32) {
//                continue;
//            }
            if (c < 128) {
                b.append(c);
            } else {
                final int replacement = getReplace(c);
                if (replacement >= 0) {
                    b.append(REPLACE[replacement]);
                }
            }
        }
        return b.toString();
    }

    private static int getReplace(final char c) {
        for (int i = 0; i < SPECIALS.length; i++) {
            if (c == SPECIALS[i]) {
                return i;
            }
        }
        return -1;
    }


}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/ViewControl.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.led.ColorLookup;
import com.bitwig.extensions.framework.di.Component;

@Component
public class ViewControl {

    private final TrackBank trackBank;
    private final TrackBank maxTrackBank;
    private final CursorTrack cursorTrack;
    private final Track rootTrack;
    private final Clip cursorClip;
    private final DeviceControl deviceControl;
    private int selectedTrackIndex;
    private final int[] trackColors = new int[8];
    private int cursorTrackColor = 0;
    private final OverviewGrid overviewGrid = new OverviewGrid();

    public ViewControl(final ControllerHost host) {
        rootTrack = host.getProject().getRootTrackGroup();
        trackBank = host.createTrackBank(8, 1, 8, true);
        maxTrackBank = host.createTrackBank(64, 1, 64, false);
        maxTrackBank.sceneBank().scrollPosition().markInterested();
        maxTrackBank.scrollPosition().markInterested();

        trackBank.sceneBank().itemCount().addValueObserver(overviewGrid::setNumberOfScenes);
        trackBank.channelCount().addValueObserver(overviewGrid::setNumberOfTracks);
        trackBank.scrollPosition().addValueObserver(pos -> {
            overviewGrid.setTrackPosition(pos);
            if (maxTrackBank.scrollPosition().get() != overviewGrid.getTrackOffset()) {
                maxTrackBank.scrollPosition().set(overviewGrid.getTrackOffset());
            }
        });
        trackBank.sceneBank().scrollPosition().addValueObserver(pos -> {
            overviewGrid.setScenePosition(pos);
            if (maxTrackBank.sceneBank().scrollPosition().get() != overviewGrid.getSceneOffset()) {
                maxTrackBank.sceneBank().scrollPosition().set(overviewGrid.getSceneOffset());
            }
        });

        cursorTrack = host.createCursorTrack(6, 128);
        trackBank.followCursorTrack(cursorTrack);
        cursorTrack.exists().markInterested();
        for (int i = 0; i < 8; i++) {
            int index = i;
            Track track = trackBank.getItemAt(i);
            prepareTrack(track);
            track.color().addValueObserver((r, g, b) -> {
                trackColors[index] = ColorLookup.toColor(r, g, b);
            });
            track.addIsSelectedInMixerObserver(select -> {
                if (select) {
                    this.selectedTrackIndex = index;
                }
            });
        }
        setUpFocusScene();

        deviceControl = new DeviceControl(cursorTrack, rootTrack);
        cursorTrack.name().markInterested();
        cursorClip = host.createLauncherCursorClip(32, 128);
        cursorClip.setStepSize(0.125);

        cursorTrack.color().addValueObserver((r, g, b) -> {
            this.cursorTrackColor = com.bitwig.extensions.controllers.novation.commonsmk3.ColorLookup.toColor(r, g, b);
        });
        prepareTrack(cursorTrack);
    }

    private void setUpFocusScene() {
        for (int i = 0; i < 64; i++) {
            final int trackIndex = i;
            Track track = maxTrackBank.getItemAt(trackIndex);
            for (int j = 0; j < 64; j++) {
                int sceneIndex = j;
                final ClipLauncherSlot slot = track.clipLauncherSlotBank().getItemAt(sceneIndex);
                slot.hasContent().addValueObserver(hasContent -> {
                    overviewGrid.setHasClips(trackIndex, sceneIndex, hasContent);
                });
                slot.isPlaybackQueued().addValueObserver(isQueued -> {
                    overviewGrid.markSceneQueued(sceneIndex, isQueued);
                });
            }
        }
    }

    public int getTrackColor(int index) {
        return trackColors[index];
    }

    public int getCursorTrackColor() {
        return cursorTrackColor;
    }

    public int getSelectedTrackIndex() {
        return selectedTrackIndex;
    }

    private void prepareTrack(final Track track) {
        track.arm().markInterested();
        track.exists().markInterested();
        track.solo().markInterested();
        track.mute().markInterested();
    }

    public void scrollToOverview(final int trackIndex, final int sceneIndex) {
        final int posX = trackIndex * 8 + overviewGrid.getTrackOffset();
        final int posY = sceneIndex * 8 + overviewGrid.getSceneOffset();
        if (posX < overviewGrid.getNumberOfTracks() && posY < overviewGrid.getNumberOfScenes()) {
            trackBank.scrollPosition().set(posX);
            trackBank.sceneBank().scrollPosition().set(posY);
        }
    }

    public boolean inOverviewGrid(final int trackIndex, final int sceneIndex) {
        return overviewGrid.inGrid(trackIndex, sceneIndex);
    }

    public boolean canScrollVertical(final int delta) {
        int newPos = overviewGrid.getScenePosition() + delta;
        return newPos >= 0 && newPos < overviewGrid.getNumberOfScenes();
    }


    public boolean canScrollHorizontal(final int delta) {
        int newPos = overviewGrid.getTrackPosition() + delta;
        return newPos >= 0 && newPos < overviewGrid.getNumberOfTracks();
    }

    public boolean inOverviewGridFocus(final int trackIndex, final int sceneIndex) {
        final int locX = overviewGrid.getTrackPosition() / 8;
        final int locY = overviewGrid.getScenePosition() / 8;
        return locX == trackIndex && locY == sceneIndex;
    }


    public TrackBank getTrackBank() {
        return trackBank;
    }

    public CursorTrack getCursorTrack() {
        return cursorTrack;
    }

    public Track getRootTrack() {
        return rootTrack;
    }

    public Clip getCursorClip() {
        return cursorClip;
    }

    public OverviewGrid getOverviewGrid() {
        return overviewGrid;
    }

    public DeviceControl getDeviceControl() {
        return deviceControl;
    }

    public boolean hasQueuedClips(int sceneIndex) {
        return overviewGrid.hasQueuedScenes(sceneIndex);
    }

    public boolean hasClips(int trackIndex, int sceneIndex) {
        return overviewGrid.hasClips(trackIndex, sceneIndex);
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/FaderBinding.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.controller.api.Parameter;
import com.bitwig.extensions.framework.Binding;

public class FaderBinding extends Binding<Parameter, FaderResponse> {

   private double lastValue = 0.0;

   public FaderBinding(final Parameter source, final FaderResponse target) {
      super(target, source, target);
      source.value().addValueObserver(this::valueChange);
   }

   private void valueChange(final double value) {
      lastValue = value;
      if (isActive()) {
         getTarget().sendValue(value);
      }
   }

   @Override
   protected void deactivate() {
   }

   @Override
   protected void activate() {
      getTarget().sendValue(lastValue);
   }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/FaderLightState.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.SingleLedState;

public class FaderLightState extends InternalHardwareLightState {
    
    public static final FaderLightState OFF = new FaderLightState(0);
    public static final FaderLightState V_WHITE = new FaderLightState(1);
    public static final FaderLightState V_RED = new FaderLightState(2);
    public static final FaderLightState BIPOLOAR_WHITE = new FaderLightState(3);
    public static final FaderLightState BIPOLOAR_RED = new FaderLightState(4);
    
    private int code;
    
    private FaderLightState(int code) {
        this.code = code;
    }
    
    @Override
    public HardwareLightVisualState getVisualState() {
        return null;
    }
    
    @Override
    public boolean equals(final Object o) {
        if(o == this) {
            return true;
        }
        if(o instanceof FaderLightState state) {
            return state.code == code;
        }
        return false;
    }
    
    public int getCode() {
        return code;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/FaderResponse.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;

public class FaderResponse {
    private final MidiProcessor midiProcessor;
    private final int aftertouchValue;
    int lastValue = -1;

    public FaderResponse(final MidiProcessor midi, final int which) {
        aftertouchValue = 0xE0 | which;
        this.midiProcessor = midi;
    }

    public void sendValue(final double v) {
        final int value = (int) (v * 16383);
        if (value != lastValue) {
            lastValue = value;
            final int lsb = value & 0x7F;
            final int msb = value >> 7;
            midiProcessor.sendMidi(aftertouchValue, lsb, msb);
        }
    }

    public int getWhich() {
        return aftertouchValue & 0xF;
    }

    public void refresh() {
        final int lsb = lastValue & 0x7F;
        final int msb = lastValue >> 7;
        midiProcessor.sendMidi(aftertouchValue, lsb, msb);
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/OledBacklight.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extension.controller.api.MultiStateHardwareLight;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.framework.Layer;

import java.util.function.Supplier;

public class OledBacklight {

    private final MultiStateHardwareLight light;
    private final MidiProcessor midiProcessor;
    private final int midiId;

    public OledBacklight(HardwareSurface hwSurface, MidiProcessor midiProcessor, int midiId) {
        light = hwSurface.createMultiStateHardwareLight("OLED_COLOR_" + midiId);
        this.midiProcessor = midiProcessor;
        this.midiId = midiId;
        light.state().onUpdateHardware(this::updateState);
    }

    // Touch State Base 0x68
    // 0 - Off
    // 1 - V white
    // 2 - V red
    // 3 - P white
    // 4 - P red

    private void updateState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof RgbLightState) {
            RgbLightState state = (RgbLightState) internalHardwareLightState;
            //midiProcessor.sendMidi(0xB0, 0x68, 1);
            midiProcessor.sendMidi(0xB0, midiId, state.getColorIndex());
        }
    }

    public int getState() {
        return ((RgbLightState) light.state().currentValue()).getColorIndex();
    }

    public void bind(Layer layer, Supplier<InternalHardwareLightState> supplier) {
        layer.bindLightState(supplier, light);
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/SingleLedButton.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc.common.control.ApcButton;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.VarSingleLedState;
import com.bitwig.extensions.framework.values.Midi;

public class SingleLedButton extends ApcButton {

    public SingleLedButton(final int noteNr, final String name, final HardwareSurface surface,
                           final MidiProcessor midiProcessor) {
        super(0, noteNr, name, surface, midiProcessor);
        light.state().setValue(RgbLightState.OFF);
        light.state().onUpdateHardware(this::updateState);
        light.setColorToStateFunction(this::colorToState);
    }

    private InternalHardwareLightState colorToState(final Color color) {
        if (color.getRed255() == 0 && color.getBlue255() == 0 && color.getGreen255() == 0) {
            return VarSingleLedState.OFF;
        }
        return VarSingleLedState.FULL;
    }

    private void updateState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof VarSingleLedState state) {
            midiProcessor.sendMidi(Midi.NOTE_ON | state.getChannel(), midiId, state.getCode());
        } else {
            midiProcessor.sendMidi(Midi.NOTE_ON, midiId, 0);
        }
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/TouchSlider.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc64.Apc64MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc64.layer.MainDisplay;
import com.bitwig.extensions.framework.Layer;

import java.util.function.Consumer;
import java.util.function.Supplier;

public class TouchSlider {

    private final HardwareSlider fader;
    private final FaderResponse response;
    private final HardwareButton touchButton;
    private final MultiStateHardwareLight light;
    private final MultiStateHardwareLight lightState;

    private final int index;
    private final Apc64MidiProcessor midiProcessor;

    public TouchSlider(final int index, final HardwareSurface surface, final Apc64MidiProcessor midiProcessor) {
        fader = surface.createHardwareSlider("FADER_" + index);
        this.index = index;
        this.midiProcessor = midiProcessor;
        final MidiIn midiIn = midiProcessor.getMidiIn();
        fader.setAdjustValueMatcher(midiIn.createAbsolutePitchBendValueMatcher(index));

        response = new FaderResponse(midiProcessor, index);

        touchButton = surface.createHardwareButton("FADER_TOUCH_" + index);
        touchButton.pressedAction().setActionMatcher(midiIn.createNoteOnActionMatcher(0, 0x52 + index));
        touchButton.releasedAction().setActionMatcher(midiIn.createNoteOffActionMatcher(0, 0x52 + index));
        touchButton.isPressed().markInterested();
        fader.setHardwareButton(touchButton);
        light = surface.createMultiStateHardwareLight("FADER_COLOR_" + index);
        light.state().onUpdateHardware(this::updateLight);
        lightState = surface.createMultiStateHardwareLight("FADER_STATE_" + index);
        lightState.state().onUpdateHardware(this::updateState);
    }

    private void updateLight(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof RgbLightState state) {
            midiProcessor.sendMidi(0xB0, 0x70 + index, state.getColorIndex());
        }
    }

    private void updateState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof FaderLightState state) {
            midiProcessor.sendMidi(0xB0, 0x68 + index, state.getCode());
        }
    }

    public void bindParameter(final Layer layer, MainDisplay display, StringValue parameterOwner,
                              final Parameter parameter) {
        layer.addBinding(new FaderBinding(parameter, response));
        layer.addBinding(
                new TouchSliderControlBinding(index, this, parameter, parameterOwner, midiProcessor.getShiftMode(),
                        midiProcessor.getClearMode(), display));
    }

    public void bindIsPressed(final Layer layer, Consumer<Boolean> consumer) {
        layer.bind(touchButton, touchButton.pressedAction(), () -> consumer.accept(true));
        layer.bind(touchButton, touchButton.releasedAction(), () -> consumer.accept(false));
    }

    public void bindLightColor(final Layer layer, Supplier<InternalHardwareLightState> supplier) {
        layer.bindLightState(supplier, light);
    }

    public void bindLightState(final Layer layer, Supplier<InternalHardwareLightState> supplier) {
        layer.bindLightState(supplier, lightState);
    }

    public boolean isTouched() {
        return touchButton.isPressed().get();
    }

    public HardwareSlider getFader() {
        return fader;
    }

    public void sendValue(final int value) {
        response.sendValue(0);
    }


    public HardwareButton getTouchButton() {
        return touchButton;
    }

    public boolean isAutomated() {
        return false;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/TouchSliderControlBinding.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc64.layer.MainDisplay;
import com.bitwig.extensions.framework.Binding;
import com.bitwig.extensions.framework.values.BooleanValueObject;

public class TouchSliderControlBinding extends Binding<AbsoluteHardwareControl, Parameter> {

    private final MainDisplay display;
    private final StringValue parameterOwner;
    private final int sliderIndex;
    private AbsoluteHardwareControlBinding hardwareBinding;
    private final Parameter parameter;
    private double downParameterValue;
    private final TouchSlider slider;
    private boolean active = false;
    private double sliderDownValue;
    private boolean stripTouched;
    private boolean fineModeActive = false;
    private boolean stripJustTouched = false;
    private boolean clearActive = false;

    public TouchSliderControlBinding(int sliderIndex, final TouchSlider source, final Parameter target,
                                     StringValue parameterOwner, BooleanValueObject fineModifierActive,
                                     BooleanValue clearModifier, MainDisplay display) {
        super(source, source.getFader(), target);
        this.sliderIndex = sliderIndex;
        this.parameter = target;
        this.slider = source;
        this.display = display;
        this.parameterOwner = parameterOwner;
        this.parameterOwner.markInterested();
        parameter.name().markInterested();
        fineModifierActive.addValueObserver(this::enableFineMode);
        clearModifier.addValueObserver(this::handleClearActive);
        slider.getTouchButton().isPressed().addValueObserver(this::handleStripTouched);
        source.getFader().value().addValueObserver(this::handleSliderValue);
        target.displayedValue().addValueObserver(this::handleParamChanged);
    }

    private void handleClearActive(boolean clearActive) {
        this.clearActive = clearActive;
        if (!active) {
            return;
        }
        if (clearActive) {
            deactivateValueBinding();
        } else {
            activate();
        }
    }

    private void handleParamChanged(String value) {
        if (active && stripTouched) {
            display.setParameterValue(value);
        }
    }

    private void handleStripTouched(boolean touched) {
        if (!active) {
            return;
        }
        if (clearActive) {
            if (touched) {
                parameter.restoreAutomationControl();
            }
        } else if (touched) {
            stripJustTouched = true;
            this.downParameterValue = parameter.value().get();
            if (active) {
                display.touchParameter(parameterOwner.get(), parameter.name().get(), parameter.displayedValue().get());
            }
        } else if (active && this.stripTouched) {
            display.releaseTouchParameter(sliderIndex);
        }
        this.stripTouched = touched;
    }

    private void handleSliderValue(double value) {
        if (stripJustTouched) {
            this.sliderDownValue = value;
            stripJustTouched = false;
        }
        if (!active) {
            return;
        }
        if (fineModeActive && stripTouched) {
            handleDelta(value);
        }
    }

    private void enableFineMode(boolean fineActive) {
        fineModeActive = fineActive;
        if (!active) {
            return;
        }
        if (fineActive) {
            if (stripTouched) {
                downParameterValue = parameter.getAsDouble();
            }
            deactivateValueBinding();
        } else {
            activate();
        }
    }

    private void handleDelta(double value) {
        if (!active) {
            return;
        }
        double delta = (value - sliderDownValue) * 0.25;
        double newValue = Math.max(0, Math.min(1, downParameterValue + delta));
        parameter.setImmediately(newValue);
    }

    private void deactivateValueBinding() {
        if (hardwareBinding != null) {
            hardwareBinding.removeBinding();
            hardwareBinding = null;
        }
    }

    @Override
    protected void activate() {
        active = true;
        hardwareBinding = addHardwareBinding();
    }

    @Override
    protected void deactivate() {
        active = false;
        if (hardwareBinding == null) {
            return;
        }
        hardwareBinding.removeBinding();
        hardwareBinding = null;
    }

    protected AbsoluteHardwareControlBinding addHardwareBinding() {
        return getSource().addBindingWithRange(getTarget(), 0, 1);
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/layer/MainDisplay.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.layer;

import com.bitwig.extension.controller.api.Application;
import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.Groove;
import com.bitwig.extension.controller.api.SettableBeatTimeValue;
import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extension.controller.api.SettableEnumValue;
import com.bitwig.extension.controller.api.Transport;
import com.bitwig.extensions.controllers.akai.apc.common.OrientationFollowType;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.VarSingleLedState;
import com.bitwig.extensions.controllers.akai.apc64.Apc64CcAssignments;
import com.bitwig.extensions.controllers.akai.apc64.Apc64MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc64.ApcPreferences;
import com.bitwig.extensions.controllers.akai.apc64.DeviceControl;
import com.bitwig.extensions.controllers.akai.apc64.HardwareElements;
import com.bitwig.extensions.controllers.akai.apc64.Menu;
import com.bitwig.extensions.controllers.akai.apc64.ModifierStates;
import com.bitwig.extensions.controllers.akai.apc64.PadMode;
import com.bitwig.extensions.controllers.akai.apc64.ViewControl;
import com.bitwig.extensions.controllers.akai.apc64.control.OledBacklight;
import com.bitwig.extensions.controllers.akai.apc64.control.SingleLedButton;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;
import com.bitwig.extensions.framework.di.Activate;
import com.bitwig.extensions.framework.di.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class MainDisplay {

    private final Layer mainLayer;
    private final Groove groove;
    private final Menu bitwigMenu;
    private final OledBacklight oledBacklight;
    private final DeviceControl deviceControl;
    private final ApcPreferences preferences;
    private boolean swingModeActive;
    private Screen currentScreen;

    private final double[] FIXED_LENGTH_PRESET_VALUES = {1, 2, 4, 8, 12, 16, 20, 24, 28, 32.0, 40, 48, 56, 64};
    private final String[] RECORD_QUANTIZE = {"OFF", "1/32", "1/16", "1/8", "1/4"};

    private final Map<ScreenMode, Screen> screens = new HashMap<>();

    private final ControllerHost host;

    private final ViewControl viewControl;
    private final Apc64MidiProcessor midiProcessor;
    private long releaseTime = -1;
    private long currentReleaseTime = 1000;
    private final Transport transport;

    private final SettableEnumValue recordQuantizeGrid;
    private SettableEnumValue postRecordingAction;
    private SettableBeatTimeValue postRecordingTimeOffset;
    private final SettableBooleanValue recordQuantizeLength;
    private EncoderMode encoderMode = EncoderMode.TRACK;
    private int touchCount = 0;

    private final ModifierStates modifierStates;

    public enum ScreenMode {
        MAIN,
        PARAMETER,
        METRO,
        FIXED,
        RECORD_QUANTIZE,
        LAUNCH_QUANTIZE,
        MENU(true),
        TEMPO,
        INFO;

        private final boolean hasEmptyBackLight;

        ScreenMode() {
            this(false);
        }

        ScreenMode(final boolean hasEmptyBackLight) {
            this.hasEmptyBackLight = hasEmptyBackLight;
        }
    }

    private enum EncoderMode {
        TRACK,
        FIXED,
        RECORD_QUANTIZE,
        MENU,
        TEMPO
    }

    public class Screen {
        private final String[] rows = {"", "", ""};
        private boolean active;
        private final ScreenMode mode;

        public Screen(final ScreenMode mode) {
            this.mode = mode;
        }

        public ScreenMode getMode() {
            return mode;
        }

        public void setScreen(final String row1, final String row2, final String row3) {
            setRow(0, row1);
            setRow(1, row2);
            setRow(2, row3);
        }

        public void setRow(final int row, final String value) {
            if (!rows[row].equals(value)) {
                rows[row] = value;
                if (active) {
                    midiProcessor.sendText(row, value);
                }
            }
        }

        public void setActive(final boolean active) {
            if (active != this.active) {
                this.active = active;
                if (active) {
                    refresh();
                }
            }
        }

        public void refresh() {
            for (int i = 0; i < 3; i++) {
                midiProcessor.sendText(i, rows[i]);
            }
        }
    }

    public MainDisplay(final Layers layers, final HardwareElements hwElements, final ViewControl viewControl,
                       final Apc64MidiProcessor midiProcessor, final ControllerHost host, final Transport transport,
                       final Application application, final ModifierStates modifierStates,
                       final ApcPreferences preferences) {
        mainLayer = new Layer(layers, "ENCODER_LAYER");
        this.viewControl = viewControl;
        this.midiProcessor = midiProcessor;
        this.host = host;
        this.transport = transport;
        this.modifierStates = modifierStates;
        this.oledBacklight = hwElements.getOledBackLight();
        this.preferences = preferences;

        Arrays.stream(ScreenMode.values()).forEach(mode -> screens.put(mode, new Screen(mode)));
        final Screen mainScreen = screens.get(ScreenMode.MAIN);

        hwElements.getMainEncoder().bind(mainLayer, this::handleEncoder);
        viewControl.getCursorTrack().name().addValueObserver(name -> mainScreen.setRow(0, name));

        deviceControl = viewControl.getDeviceControl();
        deviceControl.getDeviceName().addValueObserver(name -> toScreen(ScreenMode.MAIN, 1, name));
        deviceControl.getPageName().addValueObserver(name -> toScreen(ScreenMode.MAIN, 2, name));
        transport.isMetronomeEnabled()
                .addValueObserver(metroActive -> toScreen(ScreenMode.METRO, 2, metroActive ? "On" : "Off"));


        recordQuantizeGrid = application.recordQuantizationGrid();
        recordQuantizeGrid.addValueObserver(value -> toScreen(ScreenMode.RECORD_QUANTIZE, 2, value));
        recordQuantizeLength = application.recordQuantizeNoteLength();
        recordQuantizeLength.markInterested();
        this.groove = host.createGroove();
        this.groove.getEnabled().markInterested();

        currentScreen = mainScreen;
        currentScreen.setActive(true);
        bitwigMenu = new Menu(screens.get(ScreenMode.MENU));
        initBitwigMenu();
        hwElements.getOledBackLight().bind(mainLayer, () -> RgbLightState.of(viewControl.getCursorTrackColor()));
        hwElements.getEncoderPress().bindIsPressed(mainLayer, this::handleBasicClick);
        host.scheduleTask(this::handlePing, 100);
        initFixedLengthEdit(hwElements);
        initQuantizeEdit(hwElements);
        initTempoEdit(hwElements);

        midiProcessor.addModeChangeListener(newMode -> {
            if (newMode == PadMode.DRUM) {
                currentScreen.refresh();
                midiProcessor.activateDawMode(true);
            }
        });
    }

    public void refresh() {
        currentScreen.refresh();
    }

    public void initBitwigMenu() {
        transport.automationWriteMode().markInterested();
        transport.isArrangerAutomationWriteEnabled().markInterested();
        final String[] autoWriteModeValues = {"latch", "touch", "write"};
        // TODO Exit with long press
        // TODO Improved Value Handling int/double.
        bitwigMenu.addMenuItem(new Menu.HoldMenuItem("ALT Modifier", modifierStates.getAltActive()));
        bitwigMenu.addMenuItem(new Menu.EnumMenuItem("Auto W.Mode", transport.automationWriteMode(),
                List.of(new Menu.EnumMenuValue("latch", "LATCH"),
                        new Menu.EnumMenuValue("touch", "TOUCH"),
                        new Menu.EnumMenuValue("write", "WRITE"))));
        bitwigMenu.addMenuItem(
                new Menu.BooleanToggleMenuItem("Arrange Auto", transport.isArrangerAutomationWriteEnabled()));
        bitwigMenu.addMenuItem(
                new Menu.BooleanToggleMenuItem("Launch Auto", transport.isClipLauncherAutomationWriteEnabled()));
        bitwigMenu.addMenuItem(new Menu.BooleanToggleMenuItem("SHIFT as ALT", preferences.getAltModeWithShift()));
        //bitwigMenu.addMenuItem(new Menu.BooleanMenuItem("Groove Enabled", ));
        bitwigMenu.addMenuItem(new Menu.EnumMenuItem("Grid Layout", preferences.getGridLayoutSettings(),
                List.of(new Menu.EnumMenuValue(OrientationFollowType.AUTOMATIC.getLabel(),
                                OrientationFollowType.AUTOMATIC.getShortLabel()),
                        new Menu.EnumMenuValue(OrientationFollowType.FIXED_VERTICAL.getLabel(),
                                OrientationFollowType.FIXED_VERTICAL.getShortLabel()),
                        new Menu.EnumMenuValue(OrientationFollowType.FIXED_HORIZONTAL.getLabel(),
                                OrientationFollowType.FIXED_HORIZONTAL.getShortLabel()))));

        bitwigMenu.init();
    }

    @Activate
    public void init() {
        mainLayer.setIsActive(true);
    }

    private void toScreen(final ScreenMode mode, final int row, final String value) {
        screens.get(mode).setRow(row, value);
    }

    private void initQuantizeEdit(final HardwareElements hwElements) {
        final SingleLedButton quantizeButton = hwElements.getButton(Apc64CcAssignments.QUANTIZE);

        quantizeButton.bindIsPressed(mainLayer, this::handleQuantizePressed);
        quantizeButton.bindLightPressed(mainLayer,
                pressed -> pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10);
    }

    private void handleQuantizePressed(final boolean pressed) {
        modifierStates.getQuantizeActive().set(pressed);
        if (modifierStates.isShift()) {
            if (pressed) {
                activatePageDisplay(ScreenMode.RECORD_QUANTIZE, "RecordQuantize", recordQuantizeGrid.get());
                encoderMode = EncoderMode.RECORD_QUANTIZE;
            } else {
                returnToMain();
                encoderMode = EncoderMode.TRACK;
            }
        } else {
            // No Quantize Value available via API
        }
    }

    private void initFixedLengthEdit(final HardwareElements hwElements) {
        final SingleLedButton fixedLengthButton = hwElements.getButton(Apc64CcAssignments.FIXED);
        postRecordingTimeOffset = transport.getClipLauncherPostRecordingTimeOffset();
        postRecordingAction = transport.clipLauncherPostRecordingAction();
        postRecordingAction.markInterested();
        postRecordingTimeOffset.markInterested();
        postRecordingTimeOffset.addValueObserver(v -> {
            toScreen(ScreenMode.FIXED, 2, beatValueToString(v));
        });
        fixedLengthButton.bindDelayedHold(mainLayer, this::toggleFixedMode, this::editFixedLength, 500);
        fixedLengthButton.bindLight(mainLayer, pressed -> postRecordingAction.get()
                .equals("play_recorded") ? (pressed ? VarSingleLedState.PULSE_4 : VarSingleLedState.FULL) : VarSingleLedState.LIGHT_10);
    }

    private void initTempoEdit(final HardwareElements hwElements) {
        final SingleLedButton button = hwElements.getButton(Apc64CcAssignments.TEMPO);
        modifierStates.getShiftActive().addValueObserver(active -> {
            if (!active && swingModeActive) {
                setSwingActive(false);
            }
        });
        //button.bindDelayedHold(mainLayer, () -> transport.tapTempo(), this::handleTempoPressed, 400);
        button.bindIsPressed(mainLayer, this::handleTempoPressed);
        transport.tempo().value().markInterested();
        transport.tempo().displayedValue().markInterested();
        transport.tempo().displayedValue().addValueObserver(value -> toScreen(ScreenMode.TEMPO, 2, value));
    }

    private void handleTempoPressed(final boolean pressed) {
        if (pressed) {
            if (modifierStates.isShift()) {
                setSwingActive(true);
            } else {
                transport.tapTempo();
                encoderMode = EncoderMode.TEMPO;
                activatePageDisplay(ScreenMode.TEMPO, "Tempo", transport.tempo().displayedValue().get(), 500);
            }
        } else {
            setSwingActive(false);
            encoderMode = EncoderMode.TRACK;
            notifyRelease();
        }
    }

    private void setSwingActive(final boolean active) {
        if (this.swingModeActive != active) {
            this.swingModeActive = active;
            if (active) {
                midiProcessor.exitSessionMode();
                midiProcessor.sendMidi(0x96, 0x48, 0x7f);
            } else {
                midiProcessor.enterSessionMode();
                midiProcessor.sendMidi(0x96, 0x48, 0x00);
            }
        }
    }

    public void notifyRelease() {
        releaseTime = System.currentTimeMillis();
    }

    private void editFixedLength(final boolean held) {
        if (held) {
            activatePageDisplay(ScreenMode.FIXED, "Fixed Length", beatValueToString(postRecordingTimeOffset.get()));
            encoderMode = EncoderMode.FIXED;
        } else {
            returnToMain();
            encoderMode = EncoderMode.TRACK;
        }
    }

    private void toggleFixedMode() {
        if (postRecordingAction.get().equals("play_recorded")) {
            postRecordingAction.set("off");
        } else {
            postRecordingAction.set("play_recorded");
        }
    }

    private void handlePing() {
        if (releaseTime != -1 && (System.currentTimeMillis() - releaseTime) > currentReleaseTime) {
            changeScreenMode(stashedMode == null ? ScreenMode.MAIN : stashedMode);
            releaseTime = -1;
            stashedMode = null;
            if (!midiProcessor.modeHasTextControl() && midiProcessor.isSessionModeState()) {
                midiProcessor.exitSessionMode();
            }
        }
        host.scheduleTask(this::handlePing, 100);
    }

    private void handleBasicClick(final boolean pressed) {
        if (encoderMode == EncoderMode.TRACK) {
            handleClickMainMode(pressed);
        } else if (encoderMode == EncoderMode.MENU) {
            handleMenuClick(pressed);
        } else if (encoderMode == EncoderMode.RECORD_QUANTIZE) {
            if (pressed) {
                recordQuantizeLength.toggle();
                activatePageDisplay(ScreenMode.RECORD_QUANTIZE, "RecordQ.Len",
                        recordQuantizeLength.get() ? "OFF" : "ON");
            } else {
                activatePageDisplay(ScreenMode.RECORD_QUANTIZE, "RecordQuantize", recordQuantizeGrid.get());
            }
        }
    }

    private void handleClickMainMode(final boolean pressed) {
        if (modifierStates.isShift()) {
            if (pressed) {
                if (currentScreen.getMode() == ScreenMode.MAIN && encoderMode != EncoderMode.MENU) {
                    encoderMode = EncoderMode.MENU;
                    changeScreenMode(ScreenMode.MENU);
                }
            }
        } else {
            if (pressed) {
                activatePageDisplay(ScreenMode.METRO, "Metronome", "");
                transport.isMetronomeEnabled().toggle();
            } else {
                releaseToMain(500);
            }
        }
    }

    private String beatValueToString(final double v) {
        final double bars = v / 4;
        if (bars == 1.0) {
            return "1 Bar";
        } else if (bars > 1) {
            return "%d Bars".formatted((int) bars);
        } else {
            return "%d Beats".formatted((int) v);
        }
    }

    private void handleEncoder(final int dir) {
        if (encoderMode == EncoderMode.TRACK) {
            if (dir < 0) {
                viewControl.getCursorTrack().selectPrevious();
            } else {
                viewControl.getCursorTrack().selectNext();
            }
        } else if (encoderMode == EncoderMode.FIXED) {
            final int current = valueIndex(postRecordingTimeOffset.get(), FIXED_LENGTH_PRESET_VALUES);
            final int next = current + dir;
            if (next >= 0 && next < FIXED_LENGTH_PRESET_VALUES.length) {
                postRecordingTimeOffset.set(FIXED_LENGTH_PRESET_VALUES[next]);
            }
        } else if (encoderMode == EncoderMode.RECORD_QUANTIZE) {
            final int current = valueIndex(recordQuantizeGrid.get(), RECORD_QUANTIZE);
            final int next = current + dir;
            if (next >= 0 && next < RECORD_QUANTIZE.length) {
                recordQuantizeGrid.set(RECORD_QUANTIZE[next]);
            }
        } else if (encoderMode == EncoderMode.TEMPO) {
            double value = transport.tempo().getRaw();
            value += dir;
            transport.tempo().setRaw(value);
        } else if (encoderMode == EncoderMode.MENU) {
            handleMenuEncoder(dir);
        }
    }

    private void handleMenuEncoder(final int dir) {
        bitwigMenu.handleInc(dir);
    }

    private void handleMenuClick(final boolean pressed) {
        if (modifierStates.isShift() && pressed) {
            encoderMode = EncoderMode.TRACK;
            returnToMain();
        } else {
            bitwigMenu.handEncoderClick(pressed);
        }
    }

    private int valueIndex(final String value, final String[] values) {
        for (int i = 0; i < values.length; i++) {
            if (value.equals(values[i])) {
                return i;
            }
        }
        return -1;
    }

    private int valueIndex(final double value, final double[] values) {
        for (int i = 0; i < values.length; i++) {
            if (values[i] == value) {
                return i;
            }
        }
        for (int i = 0; i < values.length - 1; i++) {
            final double v1 = values[i];
            final double v2 = values[i + 1];
            if (v1 < value && value < v2) {
                if (Math.abs(v1 - value) < Math.abs(v2 - value)) {
                    return i;
                } else {
                    return i + 1;
                }
            }
        }
        return values.length - 1;
    }

    public void setParameterValue(final String value) {
        toScreen(ScreenMode.PARAMETER, 2, value);
    }

    public void activatePageDisplay(final ScreenMode mode, final String parameterName, final String value) {
        final Screen screen = screens.get(mode);
        screen.setRow(0, "");
        screen.setRow(1, parameterName);
        screen.setRow(2, value);
        changeScreenMode(mode);
        midiProcessor.enterSessionMode();
        releaseTime = -1;
    }

    public void activatePageDisplay(final ScreenMode mode, final String parameterName, final String value,
                                    final long releaseTime) {
        activatePageDisplay(mode, parameterName, value);
        midiProcessor.enterSessionMode();
        currentReleaseTime = releaseTime;
    }

    public void enterMode(final ScreenMode mode, final String parameterName, final String value) {
        final Screen screen = screens.get(mode);
        screen.setRow(0, "");
        screen.setRow(1, parameterName);
        screen.setRow(2, value);
        changeScreenMode(mode);
        releaseToMain(2000);
    }

    public void returnToMain() {
        changeScreenMode(ScreenMode.MAIN);
    }

    private ScreenMode stashedMode = null;

    public void touchParameter(final String destination, final String parameterName, final String value) {
        final Screen screen = screens.get(ScreenMode.PARAMETER);

        screen.setRow(0, destination);
        screen.setRow(1, parameterName);
        screen.setRow(2, value);
        midiProcessor.enterSessionMode();
        if (currentScreen.getMode() != ScreenMode.PARAMETER) {
            stashedMode = currentScreen.getMode();
            changeScreenMode(ScreenMode.PARAMETER);
        }
        touchCount++;
        releaseTime = -1;
    }

    public void releaseToMain(final long waitTime) {
        releaseTime = System.currentTimeMillis();
        currentReleaseTime = waitTime;
    }

    public void releaseTouchParameter(final int sliderIndex) {
        touchCount--;
        if (touchCount <= 0) {
            releaseToMain(1500);
            touchCount = 0;
        }
    }

    public void changeScreenMode(final ScreenMode mode) {
        if (mode != currentScreen.getMode()) {
            currentScreen.setActive(false);
            final boolean changeBackLight = mode.hasEmptyBackLight != currentScreen.getMode().hasEmptyBackLight;
            currentScreen = screens.get(mode);
            if (changeBackLight) {
                if (mode.hasEmptyBackLight) {
                    midiProcessor.sendMidi(0xB0, 0x59, 0);
                } else {
                    midiProcessor.sendMidi(0xB0, 0x59, oledBacklight.getState());
                }
            }
            currentScreen.setActive(true);
        }
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/layer/NavigationLayer.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.layer;

import java.util.function.BooleanSupplier;

import com.bitwig.extension.controller.api.BooleanValue;
import com.bitwig.extension.controller.api.SendBank;
import com.bitwig.extension.controller.api.TrackBank;
import com.bitwig.extensions.controllers.akai.apc.common.PanelLayout;
import com.bitwig.extensions.controllers.akai.apc.common.led.VarSingleLedState;
import com.bitwig.extensions.controllers.akai.apc64.Apc64CcAssignments;
import com.bitwig.extensions.controllers.akai.apc64.Apc64MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc64.ApcPreferences;
import com.bitwig.extensions.controllers.akai.apc64.DeviceControl;
import com.bitwig.extensions.controllers.akai.apc64.HardwareElements;
import com.bitwig.extensions.controllers.akai.apc64.ModifierStates;
import com.bitwig.extensions.controllers.akai.apc64.PadMode;
import com.bitwig.extensions.controllers.akai.apc64.ViewControl;
import com.bitwig.extensions.controllers.akai.apc64.control.SingleLedButton;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;
import com.bitwig.extensions.framework.di.Activate;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.di.Inject;
import com.bitwig.extensions.framework.values.ValueObject;

@Component
public class NavigationLayer {
    
    @Inject
    private PadLayer padLayer;
    
    private final Layer sessionNavigationVertical;
    private final Layer sessionNavigationHorizontal;
    private final Layer padNavigation;
    private final Layer deviceNavLayer;
    private final Layer sendsNavLayer;
    private final ViewControl viewControl;
    private final ModifierStates modifierState;
    private final TrackBank trackBank;
    private final ValueObject<PanelLayout> panelLayout;
    private PadMode currentMode = PadMode.SESSION;
    
    public NavigationLayer(final Layers layers, final HardwareElements hwElement, final ViewControl viewControl,
        final ModifierStates modifierStates, final ApcPreferences preferences, final Apc64MidiProcessor midiProcessor) {
        sessionNavigationVertical = new Layer(layers, "SESSION_NAVIGATION_VERTICAL");
        sessionNavigationHorizontal = new Layer(layers, "SESSION_NAVIGATION_HORIZONTAL");
        padNavigation = new Layer(layers, "PAD_LAYER_NAVIGATION");
        this.deviceNavLayer = new Layer(layers, "DEVICE_NAVIGATION");
        this.sendsNavLayer = new Layer(layers, "SENDS_NAVIGATION");
        this.viewControl = viewControl;
        this.modifierState = modifierStates;
        this.trackBank = viewControl.getTrackBank();
        this.panelLayout = preferences.getPanelLayout();
        this.panelLayout.addValueObserver(newValue -> {
            this.sessionNavigationVertical.setIsActive(newValue == PanelLayout.VERTICAL);
            this.sessionNavigationHorizontal.setIsActive(newValue == PanelLayout.HORIZONTAL);
        });
        midiProcessor.addModeChangeListener(this::handleModeChange);
        
        initSessionNavigation(sessionNavigationVertical, hwElement, Apc64CcAssignments.NAV_DOWN,
            Apc64CcAssignments.NAV_UP, Apc64CcAssignments.NAV_LEFT, Apc64CcAssignments.NAV_RIGHT);
        initSessionNavigation(sessionNavigationHorizontal, hwElement, Apc64CcAssignments.NAV_LEFT,
            Apc64CcAssignments.NAV_RIGHT, Apc64CcAssignments.NAV_DOWN, Apc64CcAssignments.NAV_UP);
        initPadLayerNavigation(padNavigation, hwElement);
        initDeviceNavigation(deviceNavLayer, hwElement);
        initSendsNavigation(sendsNavLayer, hwElement);
    }
    
    private void handleModeChange(final PadMode mode) {
        this.currentMode = mode;
        activateSessionNavigation(true);
    }
    
    @Activate
    public void activateLayer() {
        this.sessionNavigationVertical.setIsActive(panelLayout.get() == PanelLayout.VERTICAL);
        this.sessionNavigationHorizontal.setIsActive(panelLayout.get() == PanelLayout.HORIZONTAL);
    }
    
    private void initSessionNavigation(final Layer layer, final HardwareElements hwElements,
        final Apc64CcAssignments downButton, final Apc64CcAssignments upButton, final Apc64CcAssignments leftButton,
        final Apc64CcAssignments rightButton) {
        final SingleLedButton navDown = hwElements.getButton(downButton);
        navDown.bindRepeatHold(layer, () -> handleSessionVertical(-1));
        navDown.bindLightPressed(layer, pressed -> canNavigateVertical(pressed, -1));
        
        final SingleLedButton navUp = hwElements.getButton(upButton);
        navUp.bindRepeatHold(layer, () -> handleSessionVertical(1));
        navUp.bindLightPressed(layer, pressed -> canNavigateVertical(pressed, 1));
        
        final SingleLedButton navLeft = hwElements.getButton(leftButton);
        navLeft.bindRepeatHold(layer, () -> handleSessionHorizontal(-1));
        navLeft.bindLightPressed(layer, pressed -> canNavigateHorizontal(pressed, -1));
        
        final SingleLedButton navRight = hwElements.getButton(rightButton);
        navRight.bindRepeatHold(layer, () -> handleSessionHorizontal(1));
        navRight.bindLightPressed(layer, pressed -> canNavigateHorizontal(pressed, 1));
    }
    
    private void initPadLayerNavigation(final Layer layer, final HardwareElements hwElements) {
        final SingleLedButton navDown = hwElements.getButton(Apc64CcAssignments.NAV_DOWN);
        navDown.bindRepeatHold(layer, () -> handlePadModeNavigation(-1));
        navDown.bindLightPressed(layer, pressed -> canNavigatePadMode(pressed, -1));
        
        final SingleLedButton navUp = hwElements.getButton(Apc64CcAssignments.NAV_UP);
        navUp.bindRepeatHold(layer, () -> handlePadModeNavigation(1));
        navUp.bindLightPressed(layer, pressed -> canNavigatePadMode(pressed, 1));
        
        final SingleLedButton navLeft = hwElements.getButton(Apc64CcAssignments.NAV_LEFT);
        navLeft.bindIsPressed(layer, pressed -> {
        });
        navLeft.bindLight(layer, () -> VarSingleLedState.OFF);
        
        final SingleLedButton navRight = hwElements.getButton(Apc64CcAssignments.NAV_RIGHT);
        navRight.bindIsPressed(layer, pressed -> {
        });
        navRight.bindLight(layer, () -> VarSingleLedState.OFF);
    }
    
    private void handlePadModeNavigation(final int dir) {
        final int amount = modifierState.isShift() ? dir * 16 : dir * 4;
        padLayer.navigateBy(amount);
    }
    
    public VarSingleLedState canNavigatePadMode(final boolean pressedState, final int dir) {
        final int amount = modifierState.isShift() ? dir * 8 : dir * 4;
        if (padLayer.canNavigateBy(amount)) {
            return pressedState ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
        }
        return VarSingleLedState.OFF;
    }
    
    public void handleSessionVertical(final int dir) {
        final int amount = modifierState.isShift() ? dir * 8 : dir;
        trackBank.sceneBank().scrollBy(amount);
    }
    
    public void handleSessionHorizontal(final int dir) {
        final int amount = modifierState.isShift() ? dir * 8 : dir;
        trackBank.scrollBy(amount);
    }
    
    public VarSingleLedState canNavigateVertical(final boolean pressedState, final int dir) {
        final int amount = modifierState.isShift() ? dir * 8 : dir;
        if (viewControl.canScrollVertical(amount)) {
            return pressedState ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
        }
        return VarSingleLedState.OFF;
    }
    
    public VarSingleLedState canNavigateHorizontal(final boolean pressedState, final int dir) {
        final int amount = modifierState.isShift() ? dir * 8 : dir;
        if (viewControl.canScrollHorizontal(amount)) {
            return pressedState ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
        }
        return VarSingleLedState.OFF;
    }
    
    private void initDeviceNavigation(final Layer layer, final HardwareElements hwElements) {
        final DeviceControl deviceControl = viewControl.getDeviceControl();
        final SingleLedButton leftNav = hwElements.getButton(Apc64CcAssignments.NAV_LEFT);
        final SingleLedButton rightNav = hwElements.getButton(Apc64CcAssignments.NAV_RIGHT);
        final SingleLedButton upNav = hwElements.getButton(Apc64CcAssignments.NAV_UP);
        final SingleLedButton downNav = hwElements.getButton(Apc64CcAssignments.NAV_DOWN);
        
        rightNav.bindPressed(layer, () -> deviceControl.selectDevice(1));
        rightNav.bindLightPressed(layer, pressed -> canNavigate(pressed, () -> deviceControl.canScrollDevices(1)));
        leftNav.bindPressed(layer, () -> deviceControl.selectDevice(-1));
        rightNav.bindLightPressed(layer, pressed -> canNavigate(pressed, () -> deviceControl.canScrollDevices(-1)));
        
        upNav.bindPressed(layer, () -> navigateDeviceVertical(deviceControl, 1));
        upNav.bindLightPressed(layer, pressed -> canNavigateVertical(pressed, deviceControl, 1));
        downNav.bindPressed(layer, () -> navigateDeviceVertical(deviceControl, -1));
        downNav.bindLightPressed(layer, pressed -> canNavigateVertical(pressed, deviceControl, -1));
    }
    
    private void navigateDeviceVertical(final DeviceControl deviceControl, final int dir) {
        if (modifierState.isShift()) {
            deviceControl.navigateVertical(dir);
        } else {
            deviceControl.selectParameterPage(dir);
        }
    }
    
    private VarSingleLedState canNavigateVertical(final boolean pressed, final DeviceControl deviceControl,
        final int dir) {
        if (modifierState.isShift()) {
            if (deviceControl.canNavigateIntoDevice(dir)) {
                return pressed ? VarSingleLedState.FULL : VarSingleLedState.PULSE_2;
            }
        } else {
            if (deviceControl.canScrollParameterPages(dir)) {
                return pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
            }
        }
        return VarSingleLedState.OFF;
    }
    
    
    private void initSendsNavigation(final Layer layer, final HardwareElements hwElements) {
        final SingleLedButton leftNav = hwElements.getButton(Apc64CcAssignments.NAV_LEFT);
        final SingleLedButton rightNav = hwElements.getButton(Apc64CcAssignments.NAV_RIGHT);
        final SingleLedButton upNav = hwElements.getButton(Apc64CcAssignments.NAV_UP);
        final SingleLedButton downNav = hwElements.getButton(Apc64CcAssignments.NAV_DOWN);
        for (int i = 0; i < viewControl.getTrackBank().getSizeOfBank(); i++) {
            final SendBank sendsBank = viewControl.getTrackBank().getItemAt(i).sendBank();
            sendsBank.canScrollBackwards().markInterested();
            sendsBank.canScrollForwards().markInterested();
            sendsBank.scrollPosition().markInterested();
        }
        final SendBank sendsBank = viewControl.getTrackBank().getItemAt(0).sendBank();
        rightNav.bindPressed(layer, this::scrollSendsBackward);
        rightNav.bindLightPressed(layer, pressed -> canNavigate(pressed, sendsBank.canScrollBackwards()));
        leftNav.bindPressed(layer, this::scrollSendsForward);
        leftNav.bindLightPressed(layer, pressed -> canNavigate(pressed, sendsBank.canScrollForwards()));
        
        downNav.bindPressed(layer, () -> {
        });
        downNav.bindLightPressed(layer, pressed -> VarSingleLedState.OFF);
        upNav.bindPressed(layer, () -> {
        });
        upNav.bindLightPressed(layer, pressed -> VarSingleLedState.OFF);
    }
    
    private void scrollSendsForward() {
        final TrackBank bank = viewControl.getTrackBank();
        for (int i = 0; i < bank.getSizeOfBank(); i++) {
            bank.getItemAt(i).sendBank().scrollForwards();
        }
    }
    
    private void scrollSendsBackward() {
        final TrackBank bank = viewControl.getTrackBank();
        for (int i = 0; i < bank.getSizeOfBank(); i++) {
            bank.getItemAt(i).sendBank().scrollBackwards();
        }
    }
    
    
    public void navigateSends() {
        final TrackBank bank = viewControl.getTrackBank();
        
        for (int i = 0; i < bank.getSizeOfBank(); i++) {
            scrollRoundRobin(bank.getItemAt(i).sendBank());
        }
        
    }
    
    private void scrollRoundRobin(final SendBank sendBank) {
        if (sendBank.canScrollForwards().get()) {
            sendBank.scrollForwards();
        } else {
            sendBank.scrollPosition().set(0);
        }
    }
    
    
    private VarSingleLedState canNavigate(final boolean pressed, final BooleanValue value) {
        if (value.get()) {
            return pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
        }
        return VarSingleLedState.OFF;
    }
    
    private VarSingleLedState canNavigate(final boolean pressed, final BooleanSupplier value) {
        if (value.getAsBoolean()) {
            return pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
        }
        return VarSingleLedState.OFF;
    }
    
    public void setDeviceNavigationActive(final boolean active) {
        sendsNavLayer.setIsActive(false);
        deviceNavLayer.setIsActive(active);
        activateSessionNavigation(!active);
    }
    
    public void setSendsNavigationActive(final boolean active) {
        deviceNavLayer.setIsActive(false);
        sendsNavLayer.setIsActive(active);
        activateSessionNavigation(!active);
    }
    
    public void activateSessionNavigation(final boolean active) {
        if (active) {
            if (currentMode == PadMode.SESSION || currentMode == PadMode.OVERVIEW) {
                this.sessionNavigationVertical.setIsActive(panelLayout.get() == PanelLayout.VERTICAL);
                this.sessionNavigationHorizontal.setIsActive(panelLayout.get() == PanelLayout.HORIZONTAL);
                this.padNavigation.setIsActive(false);
            } else if (currentMode == PadMode.DRUM) {
                sessionNavigationVertical.setIsActive(false);
                sessionNavigationHorizontal.setIsActive(false);
                this.padNavigation.setIsActive(true);
            }
        } else {
            sessionNavigationVertical.setIsActive(false);
            sessionNavigationHorizontal.setIsActive(false);
            padNavigation.setIsActive(false);
        }
    }
    
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/layer/OverviewLayer.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.layer;

import com.bitwig.extensions.controllers.akai.apc.common.control.RgbButton;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc64.HardwareElements;
import com.bitwig.extensions.controllers.akai.apc64.ViewControl;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;


public class OverviewLayer extends Layer {

    private final ViewControl viewControl;

    public OverviewLayer(final Layers layers, ViewControl viewControl, HardwareElements hwElements) {
        super(layers, "OVERVIEW_LAYER");
        this.viewControl = viewControl;
        for (int i = 0; i < 8; i++) {
            final int trackIndex = i;
            for (int j = 0; j < 8; j++) {
                final int sceneIndex = j;
                final RgbButton button = hwElements.getGridButton(sceneIndex, trackIndex);
                button.bindPressed(this, () -> handleSelection(trackIndex, sceneIndex));
                button.bindLight(this, () -> getState(trackIndex, sceneIndex));
            }
        }
    }

    private void handleSelection(final int trackIndex, final int sceneIndex) {
        viewControl.scrollToOverview(trackIndex, sceneIndex);
    }

    private RgbLightState getState(final int trackIndex, final int sceneIndex) {
        if (viewControl.inOverviewGridFocus(trackIndex, sceneIndex)) {
            if (viewControl.hasClips(trackIndex, sceneIndex)) {
                return RgbLightState.ORANGE_SEL;
            }
            return RgbLightState.WHITE_SEL;
        }
        if (viewControl.hasClips(trackIndex, sceneIndex)) {
            return RgbLightState.ORANGE_FULL;
        }
        if (viewControl.inOverviewGrid(trackIndex, sceneIndex)) {
            return RgbLightState.WHITE_DIM;
        }
        return RgbLightState.OFF;
    }
}


================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/layer/PadLayer.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.layer;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.control.RgbButton;
import com.bitwig.extensions.controllers.akai.apc.common.led.ColorLookup;
import com.bitwig.extensions.controllers.akai.apc.common.led.LedBehavior;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc64.*;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.di.Inject;
import com.bitwig.extensions.framework.di.PostConstruct;

import java.util.Arrays;

@Component
public class PadLayer extends Layer {

    private static final int[] VEL_TABLE = {5, 10, 25, 60, 75, 90, 100, 127};
    private static final int[] FIXED_COLORS = {42, 42, 41, 41, 46, 46, 45, 45};

    private final double[] rateTable = {0.0833333, 0.125, 0.1666666, 0.25, 0.33333, 0.5, 0.666666, 1.0};

    //private final double[] rateTable = {0.125, 0.25, 0.5, 1.0, 2.0};
    //private final String[] rateDisplayValues = {"1/32T", "1/32", "1/16T", "1/16", "1/8T", "1/8", "1/4T", "1/4"};

    private final double[] arpRateTable = {1.0, 0.5, 0.33333, 0.25, 0.1666666, 0.125, 0.0833333, 0.0625};
    private final String[] rateDisplayValues = {"1/4", "1/8", "1/8T", "1/16", "1/16T", "1/32", "1/32T", "1/64"};
    private static final int[] ARP_COLORS = {53, 53, 56, 53, 56, 53, 56, 53};

    @Inject
    private MainDisplay mainDisplay;
    @Inject
    private FocusClip focusClip;
    private final ModifierStates states;

    private final Apc64MidiProcessor midiProcessor;
    private final ViewControl viewControl;
    private final DrumPadBank drumPadBank;
    private final NoteInput noteInput;
    private PadMode currentMode = PadMode.SESSION;
    private boolean inDrumMode = false;

    private final Layer shiftLayer;
    private final Layer clearLayer;
    private final Layer muteLayer;
    private final Layer soloLayer;

    protected final int[] padToNote = new int[16];
    private final Integer[] noteTable = new Integer[128];
    private final Integer[] velocityTable = new Integer[128];
    private final int[] padColors = new int[16];
    private final boolean[] isSelected = new boolean[16];
    private final boolean[] isPlaying = new boolean[128];
    private int padOffset = 36;
    private int fixedVelocity = -1;
    private int selectedVelocityIndex = -1;
    private int selectedNoteRepeatIndex = -1;
    private int soloHeld = 0;
    private final Arpeggiator arp;

    public PadLayer(Layers layers, ViewControl viewControl, Apc64MidiProcessor midiProcessor, ModifierStates states) {
        super(layers, "PAD_LAYER");

        this.shiftLayer = new Layer(layers, "PAD_SHIFT_LAYER");
        this.clearLayer = new Layer(layers, "PAD_CLEAR_LAYER");
        this.muteLayer = new Layer(layers, "PAD_MUTE_LAYER");
        this.soloLayer = new Layer(layers, "PAD_SOLO_LAYER");
        this.midiProcessor = midiProcessor;
        this.noteInput = midiProcessor.getNoteInput();
        arp = noteInput.arpeggiator();
        initArp();
        this.viewControl = viewControl;
        this.states = states;
        viewControl.getCursorTrack().playingNotes().addValueObserver(this::handleNotes);
        this.states.getShiftActive().addValueObserver(mod -> applyLayers());
        this.states.getClearActive().addValueObserver(mod -> applyLayers());
        PinnableCursorDevice primaryDevice = viewControl.getDeviceControl().getPrimaryDevice();
        primaryDevice.hasDrumPads().addValueObserver(this::handleHasDrumPadsChanged);
        drumPadBank = viewControl.getDeviceControl().getDrumPadBank();
        drumPadBank.scrollPosition().addValueObserver(this::handlePadBankScrolling);

        Arrays.fill(padColors, 0);
        Arrays.fill(noteTable, -1);
        Arrays.fill(padToNote, -1);
        setVelocity(-1);
        midiProcessor.addModeChangeListener(currentMode -> {
            this.currentMode = currentMode;
            if (isActive()) {
                midiProcessor.restoreState();
            }
        });
    }

    public void duplicateContent() {
        if (inDrumMode) {
            focusClip.duplicateContent();
        }
    }

    private void initArp() {
        arp.isEnabled().markInterested();
        arp.usePressureToVelocity().markInterested();
        arp.usePressureToVelocity().set(true);
        arp.octaves().markInterested();
        arp.rate().markInterested();
        arp.mode().markInterested();
        arp.rate().set(arpRateTable[0]);
    }

    private void setVelocity(int fixedValue) {
        for (int i = 0; i < 128; i++) {
            velocityTable[i] = fixedValue == -1 ? i : fixedValue;
        }
    }

    @PostConstruct
    public void init(HardwareElements hwElements) {
        for (int i = 0; i < 4; i++) {
            final int columnIndex = i;
            for (int j = 0; j < 4; j++) {
                final int rowIndex = j;
                int padIndex = rowIndex * 4 + columnIndex;
                DrumPad pad = drumPadBank.getItemAt(padIndex);
                setUpPad(padIndex, pad);
                final RgbButton button = hwElements.getGridButton(7 - rowIndex, columnIndex);
                button.bindLight(this, () -> getPadLight(padIndex, pad));
                button.bindPressed(muteLayer, () -> pad.mute().toggle());
                button.bindLight(muteLayer, () -> getPadMuteLight(padIndex, pad));
                button.bindIsPressed(soloLayer, pressed -> handleSolo(pressed, pad));
                button.bindLight(soloLayer, () -> getPadSoloLight(padIndex, pad));
                button.bindPressed(shiftLayer, () -> handleSelect(padIndex, pad));
                button.bindPressed(clearLayer, () -> clearNotes(padIndex));
            }
        }
        for (int row = 4; row < 6; row++) {
            for (int col = 4; col < 8; col++) {
                final RgbButton button = hwElements.getGridButton(row, col);
                int index = (5 - row) * 4 + (col - 4);
                button.bindPressed(this, () -> selectVelocity(index));
                button.bindLight(this, () -> getVelocityColors(index));
            }
        }
        for (int row = 6; row < 8; row++) {
            for (int col = 4; col < 8; col++) {
                final RgbButton button = hwElements.getGridButton(row, col);
                int index = (7 - row) * 4 + (col - 4);
                button.bindIsPressed(this, pressed -> setNoteRepeat(index, pressed));
                button.bindLight(this, () -> getNoteRepeatColors(index));
            }
        }
    }

    private void handleSelect(int padIndex, DrumPad pad) {
        if (isSelected[padIndex]) {
            PinnableCursorDevice cursorDevice = viewControl.getDeviceControl().getCursorDevice();
            if (cursorDevice.hasDrumPads().get()) {
                cursorDevice.selectFirstInKeyPad(padToNote[padIndex]);
            } else {
                cursorDevice.selectParent();
            }
        } else {
            pad.selectInEditor();
        }
    }

    private void handleSolo(boolean pressed, DrumPad pad) {
        if (pressed) {
            pad.solo().toggle(soloHeld == 0);
            soloHeld++;
        } else {
            soloHeld--;
        }
    }

    private void setNoteRepeat(int index, boolean pressed) {
        if (pressed) {
            if (index == selectedNoteRepeatIndex) {
                selectedNoteRepeatIndex = -1;
                arp.isEnabled().set(false);
                mainDisplay.enterMode(MainDisplay.ScreenMode.INFO, "Note Repeat", "Off");
            } else {
                selectedNoteRepeatIndex = index;
                mainDisplay.enterMode(MainDisplay.ScreenMode.INFO, "Note Repeat",
                        rateDisplayValues[selectedNoteRepeatIndex]);
                double arpRate = arpRateTable[selectedNoteRepeatIndex];
                arp.rate().set(arpRate);
                arp.mode().set("all"); // that's the note repeat way
                arp.octaves().set(0);
                arp.humanize().set(0);
                arp.isFreeRunning().set(false);
                arp.isEnabled().set(true);
            }
        }
    }

    private RgbLightState getNoteRepeatColors(int padIndex) {
        if (selectedNoteRepeatIndex == padIndex) {
            return RgbLightState.WHITE;
        }
        return RgbLightState.of(ARP_COLORS[padIndex]);
    }


    private void selectVelocity(int index) {
        if (index == selectedVelocityIndex) {
            selectedVelocityIndex = -1;
            fixedVelocity = -1;
            setVelocity(-1);
            this.noteInput.setVelocityTranslationTable(velocityTable);
            mainDisplay.enterMode(MainDisplay.ScreenMode.INFO, "Fixed Velocity", "Off");
        } else {
            selectedVelocityIndex = index;
            fixedVelocity = VEL_TABLE[selectedVelocityIndex];
            mainDisplay.enterMode(MainDisplay.ScreenMode.INFO, "Fixed Velocity", "%d".formatted(fixedVelocity));
            setVelocity(fixedVelocity);
            this.noteInput.setVelocityTranslationTable(velocityTable);
        }
    }

    private RgbLightState getVelocityColors(int padIndex) {
        if (selectedVelocityIndex == padIndex) {
            return RgbLightState.WHITE;
        }
        LedBehavior behavior = padIndex % 2 == 0 ? LedBehavior.LIGHT_50 : LedBehavior.FULL;
        return RgbLightState.of(FIXED_COLORS[padIndex], behavior);
    }

    private void clearNotes(int padIndex) {
        if (padToNote[padIndex] != -1) {
            focusClip.clearNotes(padToNote[padIndex]);
        }
    }

    private RgbLightState getPadMuteLight(int padIndex, DrumPad pad) {
        if (pad.exists().get()) {
            if (pad.mute().get()) {
                return isPlaying(padIndex) ? RgbLightState.MUTE_PLAY_FULL : RgbLightState.ORANGE_FULL;
            } else {
                return isPlaying(padIndex) ? RgbLightState.MUTE_PLAY_DIM : RgbLightState.ORANGE_DIM;
            }
        }
        return isPlaying(padIndex) ? RgbLightState.WHITE : RgbLightState.WHITE_DIM;
    }

    private RgbLightState getPadSoloLight(int padIndex, DrumPad pad) {
        if (pad.exists().get()) {
            if (pad.solo().get()) {
                return isPlaying(padIndex) ? RgbLightState.SOLO_PLAY_FULL : RgbLightState.YELLOW_FULL;
            } else {
                return isPlaying(padIndex) ? RgbLightState.SOLO_PLAY_YELLOW_DIM : RgbLightState.YELLOW_DIM;
            }
        }
        return isPlaying(padIndex) ? RgbLightState.WHITE : RgbLightState.WHITE_DIM;
    }

    private RgbLightState getPadLight(int padIndex, DrumPad pad) {
        if (isSelected[padIndex]) {
            return isPlaying(padIndex) ? RgbLightState.WHITE : RgbLightState.WHITE_SEL;
        }
        if (pad.exists().get()) {
            LedBehavior lightState = isPlaying(padIndex) ? LedBehavior.FULL : LedBehavior.LIGHT_25;
            if (padColors[padIndex] != 0) {
                return RgbLightState.of(padColors[padIndex], lightState);
            } else {
                return RgbLightState.of(viewControl.getCursorTrackColor(), lightState);
            }
        }
        return isPlaying(padIndex) ? RgbLightState.WHITE : RgbLightState.WHITE_DIM;
    }

    private void handleHasDrumPadsChanged(boolean hasDrumPads) {
        this.inDrumMode = hasDrumPads;
        if (isActive() && currentMode.isKeyRelated()) {
            midiProcessor.setDrumMode(hasDrumPads);
        }
    }

    private void handleNotes(final PlayingNote[] playingNotes) {
        if (!isActive()) {
            return;
        }
        Arrays.fill(isPlaying, false);
        for (final PlayingNote playingNote : playingNotes) {
            isPlaying[playingNote.pitch()] = true;
        }
    }

    public void activateMute(boolean activated) {
        if (!isActive()) {
            return;
        }
        soloHeld = 0;
        muteLayer.setIsActive(activated);
        padActivation(activated);
    }

    public void activateSolo(boolean activated) {
        if (!isActive()) {
            return;
        }
        soloLayer.setIsActive(activated);
        padActivation(activated);
    }

    private void padActivation(boolean activated) {
        if (activated) {
            deactivateNotes();
        } else if (!shiftLayer.isActive() && !clearLayer.isActive()) {
            applyScale();
        }
    }

    public boolean isPlaying(final int index) {
        final int offset = padOffset + index;
        if (offset < 128) {
            return isPlaying[offset];
        }
        return false;
    }

    private void handlePadBankScrolling(int scrollPos) {
        padOffset = scrollPos;
        selectPad(getSelectedIndex());
        if (isActive()) {
            applyScale();
        }
    }

    void selectPad(final int index) {
        final DrumPad pad = drumPadBank.getItemAt(index);
        pad.selectInEditor();
    }

    private int getSelectedIndex() {
        for (int i = 0; i < 16; i++) {
            if (isSelected[i]) {
                return i;
            }
        }
        return 0;
    }

    public void navigateBy(int amount) {
        drumPadBank.scrollBy(amount);
    }

    public boolean canNavigateBy(int amount) {
        int newOffset = amount + padOffset;
        return newOffset >= 0 && newOffset < 112;
    }

    void applyScale() {
        Arrays.fill(noteTable, -1);
        if (inDrumMode) {
            for (int i = 0; i < 16; i++) {
                int noteIndex = (i / 4) * 8 + i % 4;
                noteTable[noteIndex] = padOffset + i;
                padToNote[i] = padOffset + i;
            }
        }
        if (isActive()) {
            noteInput.setKeyTranslationTable(noteTable);
            noteInput.setVelocityTranslationTable(velocityTable);
            this.noteInput.setShouldConsumeEvents(true);
        }
    }

    private void setUpPad(int index, DrumPad pad) {
        pad.color().addValueObserver((r, g, b) -> padColors[index] = ColorLookup.toColor(r, g, b));
        pad.name().markInterested();
        pad.exists().markInterested();
        pad.solo().markInterested();
        pad.mute().markInterested();
        pad.addIsSelectedInEditorObserver(selected -> isSelected[index] = selected);
    }

    private void applyLayers() {
        if (!isActive()) {
            return;
        }
        if (states.isClear()) {
            clearLayer.setIsActive(true);
            shiftLayer.setIsActive(false);
            deactivateNotes();
        } else if (states.isShift()) {
            shiftLayer.setIsActive(true);
            clearLayer.setIsActive(false);
            deactivateNotes();
        } else {
            clearLayer.setIsActive(false);
            shiftLayer.setIsActive(false);
            applyScale();
        }
    }

    @Override
    protected void onActivate() {
        super.onActivate();
        if ((currentMode.isKeyRelated()) && inDrumMode) {
            midiProcessor.setDrumMode(true);
            applyScale();
        }
    }

    @Override
    protected void onDeactivate() {
        super.onDeactivate();
        deactivateNotes();
        soloHeld = 0;
        shiftLayer.setIsActive(false);
        clearLayer.setIsActive(false);
        muteLayer.setIsActive(false);
        soloLayer.setIsActive(false);
    }

    private void deactivateNotes() {
        Arrays.fill(noteTable, -1);
        noteInput.setKeyTranslationTable(noteTable);
    }


}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/layer/ParameterControlLayer.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.layer;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.led.ColorLookup;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.VarSingleLedState;
import com.bitwig.extensions.controllers.akai.apc64.Apc64CcAssignments;
import com.bitwig.extensions.controllers.akai.apc64.DeviceControl;
import com.bitwig.extensions.controllers.akai.apc64.HardwareElements;
import com.bitwig.extensions.controllers.akai.apc64.ViewControl;
import com.bitwig.extensions.controllers.akai.apc64.control.FaderLightState;
import com.bitwig.extensions.controllers.akai.apc64.control.SingleLedButton;
import com.bitwig.extensions.controllers.akai.apc64.control.TouchSlider;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;
import com.bitwig.extensions.framework.di.Activate;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.di.Inject;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class ParameterControlLayer extends Layer {


    private enum Mode {
        DEVICE(Apc64CcAssignments.STRIP_DEVICE),
        VOLUME(Apc64CcAssignments.STRIP_VOLUME),
        PAN(Apc64CcAssignments.STRIP_PAN),
        SENDS(Apc64CcAssignments.STRIP_SENDS),
        CHANNEL_STRIP(Apc64CcAssignments.STRIP_CHANNEL),
        OFF(Apc64CcAssignments.STRIP_OFF);
        private final Apc64CcAssignments assignment;

        Mode(Apc64CcAssignments assignment) {
            this.assignment = assignment;
        }

        public Apc64CcAssignments getAssignment() {
            return assignment;
        }
    }

    private Mode currentMode = Mode.VOLUME;
    private DeviceControl.Focus currentDeviceFocus = DeviceControl.Focus.DEVICE;
    private final Map<Mode, Layer> modes = new HashMap<>();
    private final Map<DeviceControl.Focus, Layer> deviceModes = new HashMap<>();

    @Inject
    private NavigationLayer navigationSection;

    private final ViewControl viewControl;
    private int cursorTrackColor = 0;
    private final MainDisplay display;

    public ParameterControlLayer(final Layers layers, HardwareElements hwElements, ViewControl viewControl,
                                 MainDisplay mainDisplay) {
        super(layers, "PARAMETER CONTROL");
        this.viewControl = viewControl;
        this.display = mainDisplay;
        Arrays.stream(Mode.values()).forEach(mode -> modes.put(mode, new Layer(layers, "STRIP_" + mode.toString())));
        Arrays.stream(DeviceControl.Focus.values())
                .forEach(mode -> deviceModes.put(mode, new Layer(layers, "DEVICE_" + mode.toString())));
        deviceModes.put(DeviceControl.Focus.DEVICE, modes.get(Mode.DEVICE));
        bindModeToButton(hwElements, Mode.DEVICE);
        bindModeToButton(hwElements, Mode.VOLUME);
        bindModeToButton(hwElements, Mode.PAN);
        bindModeToButton(hwElements, Mode.SENDS);
        bindModeToButton(hwElements, Mode.CHANNEL_STRIP);
        bindModeToButton(hwElements, Mode.OFF);
        TouchSlider[] touchSliders = hwElements.getTouchSliders();
        bindVolumeLayer(touchSliders, viewControl.getTrackBank());
        bindPanLayer(touchSliders, viewControl.getTrackBank());
        bindSendsLayer(touchSliders, viewControl.getTrackBank());
        bindCursorLayer(touchSliders, viewControl.getCursorTrack());
        bindDeviceLayer(hwElements, viewControl.getDeviceControl());
        bindOffLayer(touchSliders);
    }

    private void bindDeviceLayer(HardwareElements hwElements, DeviceControl deviceControl) {
        TouchSlider[] sliders = hwElements.getTouchSliders();

        bindToPage(sliders, deviceModes.get(DeviceControl.Focus.DEVICE),
                deviceControl.getPage(DeviceControl.Focus.DEVICE), this::faderTrackColorProvider);
        bindToPage(sliders, deviceModes.get(DeviceControl.Focus.TRACK),
                deviceControl.getPage(DeviceControl.Focus.TRACK), this::faderTrackColorProvider);
        bindToPage(sliders, deviceModes.get(DeviceControl.Focus.PROJECT),
                deviceControl.getPage(DeviceControl.Focus.PROJECT), this::faderProjectColorProvider);
        deviceControl.setFocusListener(focus -> changeDeviceFocus(focus));
    }

    private void bindToPage(TouchSlider[] sliders, Layer layer, CursorRemoteControlsPage remotePage,
                            Function<Parameter, RgbLightState> colorProvider) {
        for (int i = 0; i < sliders.length; i++) {
            TouchSlider slider = sliders[i];
            RemoteControl parameter = remotePage.getParameter(i);
            parameter.exists().markInterested();
            parameter.name().markInterested();
            bindSlider(layer, slider, parameter, colorProvider);
        }
    }

    private void bindSlider(Layer layer, TouchSlider slider, RemoteControl parameter,
                            Function<Parameter, RgbLightState> colorProvider) {
        slider.bindParameter(layer, display, parameter.name(), parameter);
        slider.bindIsPressed(layer, pressed -> parameter.touch(pressed));
        slider.bindLightColor(layer, () -> colorProvider.apply(parameter));
        slider.bindLightState(layer, () -> !parameter.exists().get() ? FaderLightState.OFF : FaderLightState.V_WHITE);
    }

    private RgbLightState faderTrackColorProvider(Parameter parameter) {
        if (parameter.exists().get()) {
            return RgbLightState.of(cursorTrackColor);
        }
        return RgbLightState.OFF;
    }

    private RgbLightState faderProjectColorProvider(Parameter parameter) {
        if (parameter.exists().get()) {
            return RgbLightState.WHITE;
        }
        return RgbLightSt(Files content cropped to 300k characters, download full ingest to see more)
================================================
FILE: README.md
================================================
# bitwig-extensions
Bitwig Studio Controller Extensions

A scripting guide and API reference resides in Bitwig Studio under Help > Documentation > Developer Resources.

## JAVA codestyle

If you plan on contributing to this repository please import `code-formatting.xml` in your IDE.



================================================
FILE: bitwig-extensions.iml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<module org.jetbrains.idea.maven.project.MavenProjectsManager.isMavenModule="true" version="4">
  <component name="ExternalSystem" externalSystem="Maven" />
  <component name="NewModuleRootManager" LANGUAGE_LEVEL="JDK_19">
    <output url="file://$MODULE_DIR$/target/classes" />
    <output-test url="file://$MODULE_DIR$/target/test-classes" />
    <content url="file://$MODULE_DIR$">
      <sourceFolder url="file://$MODULE_DIR$/src/main/java" isTestSource="false" />
      <sourceFolder url="file://$MODULE_DIR$/src/main/resources" type="java-resource" />
      <sourceFolder url="file://$MODULE_DIR$/src/test/java" isTestSource="true" />
      <excludeFolder url="file://$MODULE_DIR$/target" />
    </content>
    <orderEntry type="inheritedJdk" />
    <orderEntry type="sourceFolder" forTests="false" />
    <orderEntry type="library" name="Maven: com.bitwig:extension-api:18" level="project" />
  </component>
</module>


================================================
FILE: code-formatting.xml
================================================
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<profiles version="23">
    <profile kind="CodeFormatterProfile" name="Bitwig" version="23">
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_ellipsis" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_enum_declarations" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_allocation_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_for_statment" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.new_lines_at_block_boundaries" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_constructor_declaration_parameters" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.insert_new_line_for_parameter" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_package" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_parens_in_enum_constant" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_while" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_parens_in_annotation_type_member_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_javadoc_comments" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.indentation.size" value="3"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_enum_constant_declaration" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_semicolon_in_for" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.align_with_spaces" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.continuation_indentation" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_before_code_block" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_switch_case_expressions" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_after_package" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_multiple_local_declarations" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_enum_constant" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_angle_bracket_in_parameterized_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.indent_root_tags" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_or_operator_multicatch" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.enabling_tag" value="@formatter:on"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.count_line_length_from_starting_position" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_record_components" value="48"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_throws_clause_in_method_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_parameter" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_multiplicative_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_then_statement_on_same_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_explicitconstructorcall_arguments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_prefix_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_brace_in_array_initializer" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_angle_bracket_in_type_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_method" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_parameterized_type_references" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_logical_operator" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_parenthesized_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_annotation_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_record_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_enum_constant" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_multiplicative_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_and_in_type_parameter" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_parens_in_method_invocation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_assignment_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_type_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_for" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.preserve_white_space_between_code_and_line_comments" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_local_variable" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_abstract_method" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_enum_constant_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.align_variable_declarations_on_columns" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_method_invocation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_union_type_in_multicatch" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_at_beginning_of_method_body" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_else_statement_on_same_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_catch_clause" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_parameterized_type_reference" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_array_initializer" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_explicit_constructor_call" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_multiplicative_operator" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_anonymous_type_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_switch_case_expressions" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_shift_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_body_declarations_compare_to_annotation_declaration_header" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_block" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_at_end_of_code_block" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_bitwise_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.put_empty_statement_on_new_line" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_parameters_in_constructor_declaration" value="48"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_type_parameters" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_compact_loops" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.clear_blank_lines_in_block_comment" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_simple_for_body_on_same_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_at_end_of_file_if_missing" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_switch_case_arrow_operator" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_array_initializer" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_unary_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.format_line_comment_starting_on_first_column" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_annotation" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_ellipsis" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_semicolon_in_try_resources" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_colon_in_assert" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_enum_constant" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_and_in_type_parameter" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_parenthesized_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.text_block_indentation" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.align_type_members_on_columns" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_assignment" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_module_statements" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_body_declarations_compare_to_type_header" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_parens_in_method_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.align_tags_names_descriptions" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_enum_constant" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_if_then_body_block_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_first_class_body_declaration" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_before_closing_brace_in_array_initializer" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_constructor_declaration_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.format_guardian_clause_on_one_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_if" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.align_assignment_statements_on_columns" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_permitted_types" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_block_in_case" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_constructor_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_conditional_expression_chain" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_header" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_type_annotations" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_allocation_expression" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_assertion_message_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_switch" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_method_declaration" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.align_fields_grouping_blank_lines" value="2147483647"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.new_lines_at_javadoc_boundaries" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_bitwise_operator" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_annotation_type_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_for" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_resources_in_try" value="80"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_selector_in_method_invocation" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.never_indent_block_comments_on_first_column" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_synchronized" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_allocation_expression" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_source_code" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_array_initializer" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_field" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_at_in_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_method" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_superclass_in_type_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_parenthesized_expression_in_throw" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_not_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_type_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_brace_in_array_initializer" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_parenthesized_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_html" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_at_in_annotation_type_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_method_delcaration" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_compact_if" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_empty_lines" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_type_arguments" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_unary_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_enum_constant" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_annotation" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_enum_declarations" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_package" value="49"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_switchstatements_compare_to_switch" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_before_else_in_if_statement" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_assignment_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_label" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_body_declarations_compare_to_enum_declaration_header" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_conditional" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_method_declaration_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_cast" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_arrow_in_switch_case" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_before_while_in_do_statement" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_bracket_in_array_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_permitted_types_in_type_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_body_declarations_compare_to_record_header" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_angle_bracket_in_parameterized_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_opening_brace_in_array_initializer" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_breaks_compare_to_cases" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_method_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_bitwise_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_try" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_lambda_arrow" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_method_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.indent_tag_description" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_imple_if_on_one_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_record_constructor" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_enum_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_brackets_in_array_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_angle_bracket_in_type_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_string_concatenation" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_semicolon_in_for" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_bracket_in_array_allocation_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_multiple_fields" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_enum_constant_arguments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_prefix_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_array_initializer" value="end_of_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_shift_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_method_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_type_parameters" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_catch" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_shift_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_braces_in_array_initializer" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_multiple_local_declarations" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_simple_do_while_body_on_same_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_annotation_type_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_record_components" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_outer_expressions_when_nested" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_closing_paren_in_cast" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_synchronized" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_annotation_type_member_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_expressions_in_for_loop_header" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_additive_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_simple_getter_setter_on_one_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_while" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_angle_bracket_in_type_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_string_concatenation" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_lambda_arrow" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.join_lines_in_comments" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_record_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_relational_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_multiple_field_declarations" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_between_import_groups" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_at_in_annotation_type_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_logical_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_method_invocation" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_after_imports" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.insert_new_line_before_root_tags" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_record_declaration" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_method_declaration_throws" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_switch_statement" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_postfix_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_for_increments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_type_arguments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_arrow_in_switch_default" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_for_inits" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.disabling_tag" value="@formatter:off"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_enum_constants" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_imports" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_at_end_of_method_body" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_if_while_statement" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_closing_brace_in_block" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_parenthesized_expression_in_return" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_arrow_in_switch_case" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_field" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_between_type_declarations" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_switch_body_block_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_for" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_catch" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_switch" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_anonymous_type_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.never_indent_line_comments_on_first_column" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_for_inits" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_statements_compare_to_block" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_anonymous_type_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_question_in_wildcard" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_method_invocation_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_expressions_in_switch_case_with_arrow" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_switch" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.align_tags_descriptions_grouped" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.line_length" value="110"/>
        <setting id="org.eclipse.jdt.core.formatter.use_on_off_tags" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_method_body_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_brackets_in_array_allocation_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_loop_body_block_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_enum_constant" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_method_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_colon_in_for" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_type_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_closing_angle_bracket_in_type_arguments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_additive_operator" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_multiple_field_declarations" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_record_constructor" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_relational_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_superinterfaces" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_record_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_default" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_question_in_conditional" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_constructor_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_lambda_body" value="end_of_line"/>
        <setting id="org.eclipse.jdt.core.formatter.compact_else_if" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_type_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_catch" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_method_invocation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_method_invocation_arguments" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_method_invocation" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_throws_clause_in_constructor_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_before_catch_in_try_statement" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_try" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_parameter" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.clear_blank_lines_in_javadoc_comment" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_relational_operator" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_expressions_in_array_initializer" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_empty_lines_to_preserve" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_colon_in_case" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_additive_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_if" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_type_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_string_concatenation" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_line_comments" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.align_selector_in_method_invocation_on_expression_first_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_record_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_colon_in_labeled_statement" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_switch_case_with_arrow_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_expressions_in_switch_case_with_colon" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_after_code_block" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_superinterfaces_in_type_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_conditional_expression" value="80"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_after_annotation_on_type" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_type" value="49"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_block" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_local_variable" value="49"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_enum_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_arrow_in_switch_default" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.insert_new_line_between_different_tags" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_additive_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_method_invocation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_while" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.join_wrapped_lines" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_between_empty_parens_in_constructor_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_field" value="49"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_conditional_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_switchstatements_compare_to_cases" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_bracket_in_array_allocation_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_synchronized" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_shift_operator" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.use_tabs_only_for_leading_indentations" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_try_clause" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_code_block_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_constructor_declaration_throws" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_record_components" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.tabulation.size" value="3"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_bitwise_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_bracket_in_array_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_colon_in_conditional" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_try" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_semicolon_in_try_resources" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.continuation_indentation_for_array_initializer" value="2"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_question_in_wildcard" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_record_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_superinterfaces_in_enum_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_assignment_operator" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_labeled_statement" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_switch" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_superinterfaces" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_method_declaration_parameters" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_closing_angle_bracket_in_type_parameters" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_switch_case_with_arrow" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_lambda_body_block_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_annotations_on_method" value="49"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_parameterized_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_record_constructor_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_record_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_empty_array_initializer_on_one_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_assertion_message" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_constructor_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_new_chunk" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_bracket_in_array_allocation_expression" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_constructor_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_angle_bracket_in_parameterized_type_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_angle_bracket_in_type_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_assert" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_member_type" value="1"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_logical_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_arguments_in_qualified_allocation_expression" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_superinterfaces_in_record_declaration" value="16"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_if" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_semicolon" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_relational_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_postfix_operator" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_angle_bracket_in_type_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_cast" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.format_block_comments" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.alignment_for_parameters_in_method_declaration" value="48"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_method_declaration_throws" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_after_last_class_body_declaration" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_statements_compare_to_body" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_simple_while_body_on_same_line" value="false"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_logical_operator" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_between_statement_group_in_switch" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_bracket_in_array_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_annotation" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_enum_constant_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.parentheses_positions_in_lambda_declaration" value="common_lines"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_colon_in_case" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_comma_in_permitted_types" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_bracket_in_array_reference" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.keep_enum_declaration_on_one_line" value="one_line_never"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_method_declaration" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_enum_constant" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.brace_position_for_type_declaration" value="next_line"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_multiplicative_operator" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.blank_lines_before_package" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_for" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_for_increments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_enum_constant" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_explicitconstructorcall_arguments" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_paren_in_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.indent_body_declarations_compare_to_enum_constant_header" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_brace_in_constructor_declaration" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_comma_in_constructor_declaration_throws" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_closing_angle_bracket_in_type_parameters" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_question_in_conditional" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.comment.indent_parameter_description" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.number_of_blank_lines_at_beginning_of_code_block" value="0"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_new_line_before_finally_in_try_statement" value="insert"/>
        <setting id="org.eclipse.jdt.core.formatter.tabulation.char" value="space"/>
        <setting id="org.eclipse.jdt.core.formatter.wrap_before_string_concatenation" value="true"/>
        <setting id="org.eclipse.jdt.core.formatter.lineSplit" value="110"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_after_opening_paren_in_annotation" value="do not insert"/>
        <setting id="org.eclipse.jdt.core.formatter.insert_space_before_opening_paren_in_switch" value="insert"/>
    </profile>
</profiles>



================================================
FILE: gradlew
================================================
#!/bin/sh

#
# Copyright © 2015-2021 the original authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

##############################################################################
#
#   Gradle start up script for POSIX generated by Gradle.
#
#   Important for running:
#
#   (1) You need a POSIX-compliant shell to run this script. If your /bin/sh is
#       noncompliant, but you have some other compliant shell such as ksh or
#       bash, then to run this script, type that shell name before the whole
#       command line, like:
#
#           ksh Gradle
#
#       Busybox and similar reduced shells will NOT work, because this script
#       requires all of these POSIX shell features:
#         * functions;
#         * expansions «$var», «${var}», «${var:-default}», «${var+SET}»,
#           «${var#prefix}», «${var%suffix}», and «$( cmd )»;
#         * compound commands having a testable exit status, especially «case»;
#         * various built-in commands including «command», «set», and «ulimit».
#
#   Important for patching:
#
#   (2) This script targets any POSIX shell, so it avoids extensions provided
#       by Bash, Ksh, etc; in particular arrays are avoided.
#
#       The "traditional" practice of packing multiple parameters into a
#       space-separated string is a well documented source of bugs and security
#       problems, so this is (mostly) avoided, by progressively accumulating
#       options in "$@", and eventually passing that to Java.
#
#       Where the inherited environment variables (DEFAULT_JVM_OPTS, JAVA_OPTS,
#       and GRADLE_OPTS) rely on word-splitting, this is performed explicitly;
#       see the in-line comments for details.
#
#       There are tweaks for specific operating systems such as AIX, CygWin,
#       Darwin, MinGW, and NonStop.
#
#   (3) This script is generated from the Groovy template
#       https://github.com/gradle/gradle/blob/HEAD/subprojects/plugins/src/main/resources/org/gradle/api/internal/plugins/unixStartScript.txt
#       within the Gradle project.
#
#       You can find Gradle at https://github.com/gradle/gradle/.
#
##############################################################################

# Attempt to set APP_HOME

# Resolve links: $0 may be a link
app_path=$0

# Need this for daisy-chained symlinks.
while
    APP_HOME=${app_path%"${app_path##*/}"}  # leaves a trailing /; empty if no leading path
    [ -h "$app_path" ]
do
    ls=$( ls -ld "$app_path" )
    link=${ls#*' -> '}
    case $link in             #(
      /*)   app_path=$link ;; #(
      *)    app_path=$APP_HOME$link ;;
    esac
done

# This is normally unused
# shellcheck disable=SC2034
APP_BASE_NAME=${0##*/}
# Discard cd standard output in case $CDPATH is set (https://github.com/gradle/gradle/issues/25036)
APP_HOME=$( cd "${APP_HOME:-./}" > /dev/null && pwd -P ) || exit

# Use the maximum available, or set MAX_FD != -1 to use that value.
MAX_FD=maximum

warn () {
    echo "$*"
} >&2

die () {
    echo
    echo "$*"
    echo
    exit 1
} >&2

# OS specific support (must be 'true' or 'false').
cygwin=false
msys=false
darwin=false
nonstop=false
case "$( uname )" in                #(
  CYGWIN* )         cygwin=true  ;; #(
  Darwin* )         darwin=true  ;; #(
  MSYS* | MINGW* )  msys=true    ;; #(
  NONSTOP* )        nonstop=true ;;
esac

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar


# Determine the Java command to use to start the JVM.
if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
        # IBM's JDK on AIX uses strange locations for the executables
        JAVACMD=$JAVA_HOME/jre/sh/java
    else
        JAVACMD=$JAVA_HOME/bin/java
    fi
    if [ ! -x "$JAVACMD" ] ; then
        die "ERROR: JAVA_HOME is set to an invalid directory: $JAVA_HOME

Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
    fi
else
    JAVACMD=java
    if ! command -v java >/dev/null 2>&1
    then
        die "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.

Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
    fi
fi

# Increase the maximum file descriptors if we can.
if ! "$cygwin" && ! "$darwin" && ! "$nonstop" ; then
    case $MAX_FD in #(
      max*)
        # In POSIX sh, ulimit -H is undefined. That's why the result is checked to see if it worked.
        # shellcheck disable=SC2039,SC3045
        MAX_FD=$( ulimit -H -n ) ||
            warn "Could not query maximum file descriptor limit"
    esac
    case $MAX_FD in  #(
      '' | soft) :;; #(
      *)
        # In POSIX sh, ulimit -n is undefined. That's why the result is checked to see if it worked.
        # shellcheck disable=SC2039,SC3045
        ulimit -n "$MAX_FD" ||
            warn "Could not set maximum file descriptor limit to $MAX_FD"
    esac
fi

# Collect all arguments for the java command, stacking in reverse order:
#   * args from the command line
#   * the main class name
#   * -classpath
#   * -D...appname settings
#   * --module-path (only if needed)
#   * DEFAULT_JVM_OPTS, JAVA_OPTS, and GRADLE_OPTS environment variables.

# For Cygwin or MSYS, switch paths to Windows format before running java
if "$cygwin" || "$msys" ; then
    APP_HOME=$( cygpath --path --mixed "$APP_HOME" )
    CLASSPATH=$( cygpath --path --mixed "$CLASSPATH" )

    JAVACMD=$( cygpath --unix "$JAVACMD" )

    # Now convert the arguments - kludge to limit ourselves to /bin/sh
    for arg do
        if
            case $arg in                                #(
              -*)   false ;;                            # don't mess with options #(
              /?*)  t=${arg#/} t=/${t%%/*}              # looks like a POSIX filepath
                    [ -e "$t" ] ;;                      #(
              *)    false ;;
            esac
        then
            arg=$( cygpath --path --ignore --mixed "$arg" )
        fi
        # Roll the args list around exactly as many times as the number of
        # args, so each arg winds up back in the position where it started, but
        # possibly modified.
        #
        # NB: a `for` loop captures its iteration list before it begins, so
        # changing the positional parameters here affects neither the number of
        # iterations, nor the values presented in `arg`.
        shift                   # remove old arg
        set -- "$@" "$arg"      # push replacement arg
    done
fi


# Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
DEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'

# Collect all arguments for the java command:
#   * DEFAULT_JVM_OPTS, JAVA_OPTS, JAVA_OPTS, and optsEnvironmentVar are not allowed to contain shell fragments,
#     and any embedded shellness will be escaped.
#   * For example: A user cannot expect ${Hostname} to be expanded, as it is an environment variable and will be
#     treated as '${Hostname}' itself on the command line.

set -- \
        "-Dorg.gradle.appname=$APP_BASE_NAME" \
        -classpath "$CLASSPATH" \
        org.gradle.wrapper.GradleWrapperMain \
        "$@"

# Stop when "xargs" is not available.
if ! command -v xargs >/dev/null 2>&1
then
    die "xargs is not available"
fi

# Use "xargs" to parse quoted args.
#
# With -n1 it outputs one arg per line, with the quotes and backslashes removed.
#
# In Bash we could simply go:
#
#   readarray ARGS < <( xargs -n1 <<<"$var" ) &&
#   set -- "${ARGS[@]}" "$@"
#
# but POSIX shell has neither arrays nor command substitution, so instead we
# post-process each arg (as a line of input to sed) to backslash-escape any
# character that might be a shell metacharacter, then use eval to reverse
# that process (while maintaining the separation between arguments), and wrap
# the whole thing up as a single "set" statement.
#
# This will of course break if any of these variables contains a newline or
# an unmatched quote.
#

eval "set -- $(
        printf '%s\n' "$DEFAULT_JVM_OPTS $JAVA_OPTS $GRADLE_OPTS" |
        xargs -n1 |
        sed ' s~[^-[:alnum:]+,./:=@_]~\\&~g; ' |
        tr '\n' ' '
    )" '"$@"'

exec "$JAVACMD" "$@"



================================================
FILE: gradlew.bat
================================================
@rem
@rem Copyright 2015 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem

@if "%DEBUG%"=="" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
@rem This is normally unused
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@rem Resolve any "." and ".." in APP_HOME to make it shorter.
for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@rem Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m"

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH. 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME% 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\gradle\wrapper\gradle-wrapper.jar


@rem Execute Gradle
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*

:end
@rem End local scope for the variables with windows NT shell
if %ERRORLEVEL% equ 0 goto mainEnd

:fail
rem Set variable GRADLE_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
set EXIT_CODE=%ERRORLEVEL%
if %EXIT_CODE% equ 0 set EXIT_CODE=1
if not ""=="%GRADLE_EXIT_CONSOLE%" exit %EXIT_CODE%
exit /b %EXIT_CODE%

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega



================================================
FILE: LICENSE
================================================
MIT License

Copyright (c) 2019 Bitwig GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



================================================
FILE: pom.xml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.bitwig.extensions</groupId>
    <artifactId>bitwig-extensions</artifactId>
    <packaging>jar</packaging>
    <name>Bitwig Studio Extensions (Github)</name>
    <version>1-SNAPSHOT</version>

    <repositories>
        <repository>
            <id>bitwig</id>
            <name>Bitwig Maven Repository</name>
            <url>https://maven.bitwig.com</url>
        </repository>
    </repositories>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.5.1</version>
                <configuration>
                    <optimize>true</optimize>
                    <fork>true</fork>
                    <source>21</source>
                    <target>21</target>
                    <encoding>UTF-8</encoding>
                    <maxmem>1024m</maxmem>
                </configuration>
            </plugin>

            <plugin>
                <groupId>com.coderplus.maven.plugins</groupId>
                <artifactId>copy-rename-maven-plugin</artifactId>
                <version>1.0</version>
                <executions>
                    <execution>
                        <id>rename-file</id>
                        <phase>install</phase>
                        <goals>
                            <goal>copy</goal>
                        </goals>
                        <configuration>
                            <sourceFile>${project.build.directory}/${project.build.finalName}.jar</sourceFile>
                            <destinationFile>${project.build.directory}/Bitwig.bwextension</destinationFile>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <profiles>
        <profile>
            <id>use-local-bitwig-extension-api</id>
            <activation>
                <file>
                    <exists>../is-building-bitwig.txt</exists>
                </file>
            </activation>
            <dependencies>
                <dependency>
                    <groupId>com.bitwig</groupId>
                    <artifactId>base-extensions-api</artifactId>
                    <version>LOCAL</version>
                </dependency>
            </dependencies>
        </profile>
        <profile>
            <id>use-published-extension-api</id>
            <activation>
                <file>
                    <missing>../is-building-bitwig.txt</missing>
                </file>
            </activation>
            <dependencies>
                <dependency>
                    <groupId>com.bitwig</groupId>
                    <artifactId>extension-api</artifactId>
                    <version>[18,)</version>
                </dependency>
            </dependencies>
        </profile>
    </profiles>
</project>



================================================
FILE: .editorconfig
================================================
# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true

# Matches multiple files with brace expansion notation
[**.java]
charset = utf-8
indent_style = space
indent_size = 3
trim_trailing_whitespace = true



================================================
FILE: doc-source/Akai/Advance Keyboards.md
================================================
# AKAI Advance Keyboards

* The 8 knobs are mapped to the selected device's remote controls
* Pads, Keys, Mod-Wheel and Pitch-Bend are working
* The transport controls, and the other buttons are not



================================================
FILE: doc-source/Akai/MPK mini mk3.md
================================================
# AKAI MPK mini MK3

## Overview

This controller extension adds support for the MPK mini MK3:
 - Keys provide note input (also with a dedicated note input port)
 - Pads provide note input (also with a dedicated note input port)
 - Knobs are mapped to the selected device's remote controls, with the targeted control name shown on the screen

## Device Setup

There is no configuration required on the device; Bitwig Studio will send a custom "program" to it.

 - Do not use "PROG SELECT"; it will interfere with Bitwig Studio's connection.
 - To synchronize the MPK's arpeggiator and note repeat: go into Bitwig's Synchronization settings (Dashboard > Settings > Synchronization), and enabling sending MIDI "Clock," "Start/Stop," and "SPP" to the MPK mini MK3.



================================================
FILE: doc-source/Arturia/MicroLab.md
================================================
# Arturia MicroLab

## About this controller

This is a portable keyboard made by Arturia.
It has some additional integration with Analog Labs.

See https://www.arturia.com

## Preset navigation with Analog Lab

Start by loading Arturia Analog Lab VST3 or VST2 instrument plugin.

*Shift + Oct-/+*: loads previous/next preset

*Shift + Pitchstrip*: browse filter and categories, tap to (de)activate

*Shift + Modstrip*: browse presets, tap to select



================================================
FILE: doc-source/Devine/EZ-Creator Fade.md
================================================
# Device EZ-Creator Fade

## Transport

The transport buttons are working.

## Channel controls

Each column contains a knob which controls the track's pan.
Then comes a vertical fader which controls the track's volume.
And finally a button which toggles the track's mute.

The first 8 columns control the 8 tracks of the track bank. You can move the track bank by using the two buttons on the right of the four leds on the bottom.

The last column control the master track.

## AB Crossfade

The horizontal crossfade controls the AB crossfade.



================================================
FILE: doc-source/Devine/EZ-Creator Key.md
================================================
# Devine EZ-Creator Key

Keys are working as expected.

The knob is controlling the first remote control of the selected device.

The pitch up and down button do nothing.



================================================
FILE: doc-source/Devine/EZ-Creator Pads.md
================================================
# Define EZ-Creator Pads

## Pads

The pads are working and mapped in order to play well with the first 12 pads of Bitwig Studio's drum machine.

## Transport

The transport buttons are working as expected.

## Fader

The fader controls the first remote control of the selected device.

## Bank button

This button does nothing.

## 2 Buttons next to the Bank leds

They select the previous or next track.



================================================
FILE: doc-source/Devine/EZ-Creator Plus.md
================================================
# Devine EZ-Creator Plus

## Pads

The pads are working and mapped to work well with the Bitwig Drum Machine.

## Keys

The keys are working.

## Knobs

They control the 1-4 remote controls of the selected device.

## Faders

They control the 5-8 remote controls of the selected device.



================================================
FILE: doc-source/Devine/VersaKey 25.md
================================================
# Devine VersaKey 25

## Pads

The pads are working and mapped to work well with the Bitwig Drum Machine.

## Keys

The keys are working.

## Knobs

They control the 1-4 remote controls of the selected device.

## Transport

The transport controls are working as indicated on the buttons.



================================================
FILE: doc-source/Devine/VersaKey 49.md
================================================
# Devine VersaKey 49

## Pads

The pads are working and mapped to work well with the Bitwig Drum Machine.

## Keys

The keys are working.

## Knobs

They control the 1-8 remote controls of the selected device.

## Transport

The transport controls are working as indicated on the buttons.



================================================
FILE: doc-source/Devine/VersaKey 61.md
================================================
# Devine VersaKey 61

## Pads

The pads are working and mapped to work well with the Bitwig Drum Machine.

## Keys

The keys are working.

## Knobs

They control the 1-8 remote controls of the selected device.

## Transport

The transport controls are working as indicated on the buttons.



================================================
FILE: doc-source/Devine/VersaKey 88.md
================================================
# Devine VersaKey 88

## Pads

The pads are working and mapped to work well with the Bitwig Drum Machine.

## Keys

The keys are working.

## Knobs

They control the 1-8 remote controls of the selected device.

## Transport

The transport controls are working as indicated on the buttons.



================================================
FILE: doc-source/Generic/E-Drum.md
================================================
# Generic E-Drum

* A simple generic MIDI E-Drum controller extension which creates a MIDI note input
* Supports generic transport control (via sysex)



================================================
FILE: doc-source/Kenton/KillaMixMini.md
================================================
# Kenton KillaMix Mini

## Introduction

This extension offers two modes to control Bitwig Studio. The first one is a simple mixer mode, the other one is for device control.
You can switch between the two modes with button 9.

Before you can use this extension, you will have to set the Kenton KillaMix up, see section _Setup_.

## Device Mode
      
This mode allows you to navigte tracks, devices and device-pages in Bitwig Studio. Knobs 1-8 control the currently
selected device/page macros. Knob 9 always adjusts the volume of the current track. The buttons 1-6 allow you to navigate in the following way:
* Buttons 1 & 2: select previous/next track
* Buttons 3 & 4: select previous/next device
* Buttons 5 & 6: select previous/next device-page     

The button light indicates if the previous/next step for navigation is available. The joystick is freely mappable. In the Studio I/O panel on the right
side of the Bitwig Studio window, you can select between displaying the parameter with or without applied modulations on the encoder ring.

## Mixer Mode
In this mode the knobs control the track volumes of 8 consecutive tracks. Use the joystick left/right to navigate the tracks. The buttons toggle
between mute/unmute for the respective tracks. Knob 9 controls the master volume.

## Setup
In order for this integration to work, the Kenton KillaMix controller needs to be setup in a way that allows
Bitwig to communicate back controller values. This is achieved in the following way:</p>
* Enable relative knob updates: while plugging in the USB cable, press <b>buttons</b> 6 and 8. Hold this for several seconds, then release the buttons. Button 9 (and potentially others) will illuminate to indicate that the configuation mode has been entered. Press <b>button</b> 1 several times until the <b>encoder ring</b> above it shows two illuminated segments ( Ableton signed 7 bit mode ). Proceed with the next step.
* Enable CC updates: Press <b>button</b> 3 until the <b>encoder ring</b> above it shows one lit LED (receive CC mode). Press <b>button</b> 9 to save and exit this configuration mode.
* Enable button toggle behavior: while the controller is on, press and hold <b>knob</b> 9 while pressing <b>knob</b> 8. Release both knobs, all encoder rings will light up to show that the button configuration mode has been entered. Press each <b>button</b> several times until it starts flashing. Do this for all buttons. To exit this configuration mode, press any <b>knob</b>. 



================================================
FILE: doc-source/MIDIPLUS/Xmini Keyboards.md
================================================
# MIDIPlus Xmini Keyboards

* The four knobs controls the first four remote controls of the selected device
* Keys, Pitch-Bend and Mod-Wheel are working
* Transport buttons are working

Make sure your controller has the latest firmware update.



================================================
FILE: doc-source/MIDIPLUS/XPro Keyboards.md
================================================
# MIDIPlus XPro Keyboards

* The eight knobs controls the remote controls of the selected device
* Pads are working and will be mapped to the first 8 pads of the Bitwig Studio drum machine
* Keys, Pitch-Bend and Mod-Wheel are working
* Transport buttons are working

Make sure your controller has the latest firmware update.



================================================
FILE: doc-source/Novation/Launch Control XL.md
================================================
# Launch Control XL

This controller extension only works with the factory templates; user templates are ignored because they're not predictable.

To switch between factory templates, press the Factory button (top right) and the bottom row of buttons becomes green.
Select one of the factory templates between 1 and 5.

## Volume faders

The eight volume faders always control the **track volume**. You can scroll the track bank using the track select arrows.

## Track focus

The track focus buttons always **selects** the track.

## Track control / Device Bank

This is a multi-function row of buttons.

You can configure their function by pushing one of the **Mute**, **Solo**, **Record Arm** or **Device** button on the right.
In case of device, it lets you select the *remote controls page* for the selected device.

# Templates

## Factory template 1: Two sends and device mode

The *first* and *second* knobs rows control the **sends**. You can *scroll* the *send window* using the send select buttons.
The *third* knob row controls the **remote controls** of the currently *selected device*.

## Factory template 2: Two sends and device mode

The *first* and *second* knobs rows control the **sends**. You can *scroll* the *send window* using the send select buttons.
The *third* knob row controls the first **remote controls** of track's device.

## Factory template 3: Two sends and project remotes

Same as above except that the *third* row controls the **project's remotes**.

## Factory template 4: Three sends mode

Same as above except that the *third* row is an additional **send** control.

## Factory template 5: One send and Two channel device controls mode

The *first* row of knobs controls the **send**.
The *second* and *third* rows of knobs controls the two first **remote controls** of each track's *selected device*.

## Factory template 6: Three channel device controls mode

The *first*, *second* and *third* rows of knobs controls the three first **remote controls** of each track's *selected device*.

## Factory template 7: Three track remote controls mode

The *first*, *second* and *third* rows of knobs controls the three first **remote controls** of each track.



================================================
FILE: doc-source/Novation/Launchkey Mini.md
================================================
# Launchkey Mini

## Modes

This controller extension offers 3 modes: PLAY, LAUNCH and DRUM

Cycle through modes with the > (INCONTROL) button.

### PLAY mode

In this mode the 8 knobs are mapped to remote controls.

The upper 8 drum-pads are used to select remote control parameter pages.

The lower 8 drum-pads are used to select the device within the device chain.

Track ◂▸ changes the selected track.

__Browser__

The popup browser can be opened by:
* pressing one of the round ▹ buttons (replacing)
* Selecting an empty device (inserts at the end of the chain)

▴ Select previous item

▾ Select next item

▹ (Red) Cancel

▹ (Green) Commit


### LAUNCH mode

In this mode the drum-pads launches clips on a 8 track x 2 scene window

Track ◂▸ and scene ▴▾ buttons are used or navigation and the round ▹ buttons are used to launch the entire scene.

In this mode the 8 knobs are freely mappable independently from the PLAY mode.

### DRUM mode

In this mode the drum-pads act as actual drum pads.

The 8 knobs are borrowed from the LAUNCH mode and the browser can be used as in the PLAY mode.


================================================
FILE: doc-source/Novation/Launchkey MK2.md
================================================
# Launchkey MK2

## Modes

This controller extension offers 3 modes: PLAY, LAUNCH and DRUM

Select modes with the 3 INCONTROL buttons.

### PLAY mode

In this mode the 8 knobs are mapped to remote controls.

The upper 8 drum-pads are used to select remote control parameter pages.

The lower 8 drum-pads are used to select the device within the device chain.

The 9 sliders are mapped to envelope or drawbars.

Track ◂▸ changes the selected track.

__Browser__

The popup browser can be opened by:
* pressing one of the round ▹ buttons (replacing)
* Selecting an empty device (inserts at the end of the chain)

▴ Select previous item

▾ Select next item

▹ (Red) Cancel

▹ (Green) Commit


### LAUNCH mode

In this mode the drum-pads launches clips on a 8 track x 2 scene window

Track ◂▸ and scene ▴▾ buttons are used or navigation and the round ▹ buttons are used to launch the entire scene.

In this mode the 8 knobs are freely mappable independently from the PLAY mode.

Sliders 1-9 are mapped to track volume (9 - master track)

### DRUM mode

In this mode the drum-pads act as actual drum pads.

The 8 knobs are mapped to the remote controls of the drum instrument.

Sliders 1-9 are mapped to track volume (9 - master track) 

The browser can be used as in the PLAY mode.


## Buttons 1-9 ##

Button 1-8 toggles either mute or solo of the 8 active tracks, depending on the state of button 9. 


================================================
FILE: doc-source/Novation/LaunchPad Pro.md
================================================
# LaunchPad PRO

## Overview

This controller extension brings the following features to the controller:
 - Clip launcher via session mode
 - Keyboard and Drum play
    - Selection of modes and root key
 - Drum sequencer
 - Step sequencer
 - Basic mixer controls
    - Arm/Solo/Mute and Track select
    - Volume/Pan/Sends control

## Device Setup

You should configure your launchpad as follow:
 - Press the setup button
 - Choose the programmer mode
 - Select Polyphonic after touch

## Global Functions

|Function|How|
|---|---|
|Toggle Metronome|Press **Click**|
|Tap Tempo|Hold **Shift** and tap **Click**|
|Stop all clips|Hold **Shift** and press **Stop Clip**|
|Toggle Play|Press **Double**|
|Toggle Arranger Record|Hold **Shift** and press **Double**|
|Duplicate|Press **Duplicate**|
|Undo|Press **Undo**|
|Redo|Press **Redo**|

## Session Mode

To activate the session mode, press **Session**.
Then you'll see the clips on the pads and the scenes launchers on the right.
Note that if you change the color of a scene, it will update the scene launcher button accordingly.

|Function|Shortcut|
|---|---|
|Launch a clip|Press the pad|
|Launch a scene|Press the scene button (on the right)|
|Stop a clip|Press **Stop Clip** and choose the track to stop in the bottom row|
|Stop all clips|Hold **Shift** and press **Stop Clip**|
|Move the clip launcher window|Use the arrows on top left, hold **Shift** to scroll by page|
|Select a clip|hold **Shift** and press the pad|
|Delete a clip|hold **Delete** and press the pad|
|Quantize a clip|hold **Quantize** and press the pad|

## Play Mode

Activate the *Play Mode* by pressing the **Note** button.

The *Play Mode* lets you play notes via a few different layouts.
You can select the different layouts by pressing a scene buttons.

|Index|Layout Name|
|---|---|
|1|Guitar|
|2|Line/3|
|3|Line/7|
|4|Piano|
|5|64 Drums|
|6|*Unused*|
|7|*Unused*|
|8|Root Key and Mode chooser|

## Drum Sequencer Mode

Activate the Drum Sequencer Mode by pressing the **Device** button.

The *Drum Sequencer* needs a clip to be selected first.

The grid is divided in two parts, the 32 upper pads are for the steps, while the 32 others are for drums, performances and data.

### Steps

The 32 upper pads displays 32 steps. The light will be bright if there is a note on at this steps, dimmed if there is a sustained note or off if there is nothing.

The four scenes on the right lets you edit up to 8 bars, each scene buttons will display 2 bars: [1,2], [3,4], [5,6], [7,8].

To set the length of the clip, you can hold **Shift** and press one of the 8 scene buttons, or a step.

### Minor Modes

To select a minor mode, press one of the four scene buttons on the bottom right.
There are four minor modes:

|Index|Description|
|---|---|
|1|Play drums, note repeat, clip operations, select/solo/mute of a pad|
|2|Play drums, performance macros and scene macros|
|3|Edit Velocity, Note Length and Pan **per step**|
|3|Edit Micro Tuning, Timbre and Pressure **per step**|

#### 1. Play drums and basic actions

On the bottom left you'll see a 4x4 grid of pads which you can play.
Playing a pad will select the given drum pad in the sequencer above.
You can select a pad without playing it by pressing **Shift** + **Pad**.

On the bottom right, there will be a bunch of *action* pads. They work by holding them, and then pressing a pad.
You'll have a various different note repeat speed at the top and *Drum Pad Select*, *Mute* and *Solo* at the bottom.
You can un-mute all drum pads by doing **Delete** + **Mute Pad**.
You can un-solo all drum pads by doing **Delete** + **Solo Pad**.

#### 2. Drum Performances and Scenes

To use this minor mode, add two remote control pages to your drum kit:
 - One page with 8 Knobs, and add the tag *drum-perfs*
 - One page with 8 buttons, and add the tag *drum-scenes*

## Step Sequencer Mode

Activate the *Step Sequencer Mode* by pressing the **User** button.

This mode is very similar to the *Drum Sequencer Mode* except that it is intended to sequence notes.
To enter a step, hold the steps and press the pitches. 

## Volume Mode

Activate the *Volume Mode* by pressing the **Volume** button.

## Pan Mode

Activate the *Pan Mode* by pressing the **Pan** button.

## Sends Mode

Activate the *Sends Mode* by pressing the **Sends** button.



================================================
FILE: doc-source/Vault/Apex.md
================================================
# Vault Apex 25, 49 and 61

## Transport

Transport buttons are working.

## Keys

There is a dedicated input "Apex Keys" with the key events, mod-wheel and pitch bend.

## Pads

There is a dedicated input "Apex Pads" with the pad events.

## Knobs

The knobs are mapped to the remote controls of the selected device.

## Faders

The faders control the track volume. The last fader controls the master track volume.



================================================
FILE: gradle/wrapper/gradle-wrapper.properties
================================================
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.6-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/advance/AdvanceControllerExtension.java
================================================
package com.bitwig.extensions.controllers.akai.advance;

import com.bitwig.extension.controller.ControllerExtension;
import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.CursorRemoteControlsPage;
import com.bitwig.extension.controller.api.CursorTrack;
import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extension.controller.api.MidiOut;
import com.bitwig.extension.controller.api.NoteInput;
import com.bitwig.extension.controller.api.PinnableCursorDevice;
import com.bitwig.extension.controller.api.RemoteControl;

public class AdvanceControllerExtension extends ControllerExtension
{
   public AdvanceControllerExtension(
      final AdvanceControllerExtensionDefinition definition, final ControllerHost host)
   {
      super(definition, host);
   }

   @Override
   public void init()
   {
      final ControllerHost host = getHost();

      mMidiIn = host.getMidiInPort(0);
      mMidiIn.setMidiCallback(this::onMiniIn);
      mMidiIn.setSysexCallback(this::onSysexIn);

      mKeyboardInput = mMidiIn.createNoteInput("Keyboard", "80????", "90????", "B001??", "B00B??", "B040??", "D0????", "E0????");
      mKeyboardInput.setShouldConsumeEvents(true);

      mPadInput = mMidiIn.createNoteInput("Pads", "89????", "99????", "B901??", "B90B??", "B940??", "D9????", "E9????");
      mPadInput.setShouldConsumeEvents(true);

      mMidiOut = host.getMidiOutPort(0);

      mCursorTrack = host.createCursorTrack("0", "Akai Advance", 0, 0, true);
      mCursorDevice = mCursorTrack.createCursorDevice();
      mRemoteControls = mCursorDevice.createCursorRemoteControlsPage(8);
      for (int i = 0; i < 8; ++i)
      {
         final RemoteControl parameter = mRemoteControls.getParameter(i);
         parameter.setIndication(true);
      }
   }

   @Override
   public void exit()
   {

   }

   @Override
   public void flush()
   {

   }

   private void onMiniIn(final int status, final int data1, final int data2)
   {
      int channel = status & 0xF;
      int msg = status >> 4;

      //getHost().println("MIDI IN, msg: " + msg + " channel: " + channel + ", data1: " + data1 + ", data2: " + data2);

      switch (msg)
      {
         case 11:
         {
            if (50 <= data1 && data1 < 58)
            {
               int index = data1 - 50;
               int inc = data2 < 64 ? data2 : (data2 - 128);
               double scaledInc = inc / 128.0f;
               mRemoteControls.getParameter(index).inc(scaledInc);
            }
         }
      }
   }

   private void onSysexIn(final String sysex)
   {
      getHost().println("got sysex: " + sysex);
   }

   private MidiIn mMidiIn;
   private MidiOut mMidiOut;
   private NoteInput mKeyboardInput;
   private NoteInput mPadInput;
   private CursorTrack mCursorTrack;
   private PinnableCursorDevice mCursorDevice;
   private CursorRemoteControlsPage mRemoteControls;
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/advance/AdvanceControllerExtensionDefinition.java
================================================
package com.bitwig.extensions.controllers.akai.advance;

import java.util.UUID;

import com.bitwig.extension.api.PlatformType;
import com.bitwig.extension.controller.AutoDetectionMidiPortNamesList;
import com.bitwig.extension.controller.ControllerExtension;
import com.bitwig.extension.controller.ControllerExtensionDefinition;
import com.bitwig.extension.controller.api.ControllerHost;

public class AdvanceControllerExtensionDefinition extends ControllerExtensionDefinition
{
   private final static UUID ID = UUID.fromString("fbfd5fd9-1e34-4a38-9306-12e4f83fb8a8");

   @Override
   public String getHardwareVendor()
   {
      return "Akai";
   }

   @Override
   public String getHardwareModel()
   {
      return "ADVANCE 25/49/61";
   }

   @Override
   public int getNumMidiInPorts()
   {
      return 1;
   }

   @Override
   public int getNumMidiOutPorts()
   {
      return 1;
   }

   @Override
   public void listAutoDetectionMidiPortNames(
      final AutoDetectionMidiPortNamesList list, final PlatformType platformType)
   {
      switch (platformType)
      {
         case LINUX:
            list.add(new String[]{"ADVANCE25 MIDI 1"}, new String[]{"ADVANCE25 MIDI 1"});
            list.add(new String[]{"ADVANCE49 MIDI 1"}, new String[]{"ADVANCE49 MIDI 1"});
            list.add(new String[]{"ADVANCE61 MIDI 1"}, new String[]{"ADVANCE61 MIDI 1"});
            break;

         case WINDOWS:
            list.add(new String[]{"ADVANCE25"}, new String[]{"ADVANCE25"});
            list.add(new String[]{"ADVANCE49"}, new String[]{"ADVANCE49"});
            list.add(new String[]{"ADVANCE61"}, new String[]{"ADVANCE61"});
            break;

         case MAC:
            list.add(new String[]{"ADVANCE25 Port 1"}, new String[]{"ADVANCE25 Port 1"});
            list.add(new String[]{"ADVANCE49 Port 1"}, new String[]{"ADVANCE49 Port 1"});
            list.add(new String[]{"ADVANCE61 Port 1"}, new String[]{"ADVANCE61 Port 1"});
            break;
      }
   }

   @Override
   public ControllerExtension createInstance(final ControllerHost host)
   {
      return new AdvanceControllerExtension(this, host);
   }

   @Override
   public String getName()
   {
      return getHardwareModel();
   }

   @Override
   public String getAuthor()
   {
      return "Bitwig";
   }

   @Override
   public String getVersion()
   {
      return "1.0";
   }

   @Override
   public UUID getId()
   {
      return ID;
   }

   @Override
   public int getRequiredAPIVersion()
   {
      return 3;
   }

   public static AdvanceControllerExtensionDefinition getInstance()
   {
      return mInstance;
   }

   @Override
   public String getHelpFilePath()
   {
      return "Controllers/Akai/Advance Keyboards.html";
   }

   private static AdvanceControllerExtensionDefinition mInstance = new AdvanceControllerExtensionDefinition();
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/AbstractSessionLayer.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common;

import com.bitwig.extension.controller.api.ClipLauncherSlot;
import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extension.controller.api.Track;
import com.bitwig.extension.controller.api.TrackBank;
import com.bitwig.extensions.controllers.akai.apc.common.led.LedBehavior;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.novation.commonsmk3.ColorLookup;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;

public abstract class AbstractSessionLayer extends Layer {
    protected final int[][] colorIndex = new int[8][8];
    protected SettableBooleanValue clipLauncherOverdub;

    public AbstractSessionLayer(final Layers layers) {
        super(layers, "SESSION_LAYER");
    }

    protected abstract boolean isPlaying();

    protected abstract boolean isShiftHeld();

    protected RgbLightState getState(final Track track, final ClipLauncherSlot slot, final int trackIndex,
                                     final int sceneIndex) {
        if (slot.hasContent().get()) {
            final int color = colorIndex[sceneIndex][trackIndex];
            if (slot.isSelected().get() && isShiftHeld()) {
                return RgbLightState.WHITE_BRIGHT;
            }
            if (slot.isRecordingQueued().get()) {
                return RgbLightState.RED.behavior(LedBehavior.BLINK_4);
            } else if (slot.isRecording().get()) {
                return RgbLightState.RED.behavior(LedBehavior.PULSE_2);
            } else if (slot.isPlaybackQueued().get()) {
                return RgbLightState.of(color, LedBehavior.BLINK_4);
            } else if (slot.isStopQueued().get()) {
                return RgbLightState.GREEN_PLAY.behavior(LedBehavior.BLINK_8);
            } else if (slot.isPlaying().get() && track.isQueuedForStop().get()) {
                return RgbLightState.GREEN.behavior(LedBehavior.BLINK_8);
            } else if (slot.isPlaying().get()) {
                if (clipLauncherOverdub.get() && track.arm().get()) {
                    return RgbLightState.RED.behavior(LedBehavior.PULSE_2);
                } else {
                    if (isPlaying()) {
                        return RgbLightState.GREEN_PLAY;
                    }
                    return RgbLightState.GREEN;
                }
            }
            return RgbLightState.of(color);
        }
        if (slot.isSelected().get() && isShiftHeld()) {
            return RgbLightState.WHITE_DIM;
        }
        if (slot.isRecordingQueued().get()) {
            return RgbLightState.RED.behavior(LedBehavior.BLINK_8); // Possibly Track Color
        } else if (track.arm().get()) {
            return RgbLightState.RED.behavior(LedBehavior.LIGHT_25);
        }
        return RgbLightState.OFF;
    } // V ultra_X_39--

    protected void markTrackBank(TrackBank bank) {
        bank.canScrollBackwards().markInterested();
        bank.canScrollForwards().markInterested();
        bank.sceneBank().canScrollBackwards().markInterested();
        bank.sceneBank().canScrollForwards().markInterested();
    }

    protected void markTrack(final Track track) {
        track.isStopped().markInterested();
        track.mute().markInterested();
        track.solo().markInterested();
        track.isQueuedForStop().markInterested();
        track.arm().markInterested();
    }

    protected void prepareSlot(final ClipLauncherSlot slot, final int sceneIndex, final int trackIndex) {
        slot.hasContent().markInterested();
        slot.isPlaying().markInterested();
        slot.isStopQueued().markInterested();
        slot.isRecordingQueued().markInterested();
        slot.isRecording().markInterested();
        slot.isPlaybackQueued().markInterested();
        slot.isSelected().markInterested();
        slot.color().addValueObserver((r, g, b) -> colorIndex[sceneIndex][trackIndex] = ColorLookup.toColor(r, g, b));
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/MidiProcessor.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common;

import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extension.controller.api.NoteInput;
import com.bitwig.extensions.framework.time.TimedEvent;

import java.util.function.IntConsumer;

public interface MidiProcessor {

    NoteInput createNoteInput(String name, String... mask);

    void sendMidi(final int status, final int val1, final int val2);

    void start();

    void queueEvent(TimedEvent currentTimer);

    void setModeChangeListener(final IntConsumer modeChangeListener);

    MidiIn getMidiIn();

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/OrientationFollowType.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common;

import java.util.Arrays;

public enum OrientationFollowType {
    AUTOMATIC("Automatic", "Auto"), //
    FIXED_VERTICAL("Mix Panel Layout", "Mixer"), //
    FIXED_HORIZONTAL("Arrange Panel Layout", "Arrange");

    private final String label;
    private final String shortLabel;

    OrientationFollowType(final String label, final String shortLabel) {
        this.label = label;
        this.shortLabel = shortLabel;
    }

    public String getLabel() {
        return label;
    }

    public String getShortLabel() {
        return shortLabel;
    }

    public static OrientationFollowType toType(final String value) {
        return Arrays.stream(OrientationFollowType.values())
                .filter(type -> type.label.equals(value))
                .findFirst()
                .orElse(OrientationFollowType.FIXED_VERTICAL);
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/PanelLayout.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common;

public enum PanelLayout {
   VERTICAL,
   HORIZONTAL
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/ApcButton.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.time.TimeRepeatEvent;
import com.bitwig.extensions.framework.time.TimedDelayEvent;
import com.bitwig.extensions.framework.time.TimedEvent;

import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

public abstract class ApcButton {
    public static final int STD_REPEAT_DELAY = 400;
    public static final int STD_REPEAT_FREQUENCY = 50;

    protected MultiStateHardwareLight light;
    protected HardwareButton hwButton;
    protected MidiProcessor midiProcessor;
    private TimedEvent currentTimer;
    private long recordedDownTime;
    protected final int midiId;

    protected ApcButton(final int channel, final int midiId, final String name, final HardwareSurface surface,
                        final MidiProcessor midiProcessor) {
        this.midiProcessor = midiProcessor;
        final MidiIn midiIn = midiProcessor.getMidiIn();
        this.midiId = midiId;
        hwButton = surface.createHardwareButton(name + "_" + midiId);
        hwButton.pressedAction().setPressureActionMatcher(midiIn.createNoteOnVelocityValueMatcher(channel, midiId));
        hwButton.releasedAction().setActionMatcher(midiIn.createNoteOffActionMatcher(channel, midiId));
        light = surface.createMultiStateHardwareLight(name + "_LIGHT_" + midiId);
        light.state().setValue(RgbLightState.OFF);
        hwButton.setBackgroundLight(light);
        hwButton.isPressed().markInterested();
    }


    public void refresh() {
        light.state().setValue(null);
    }

    public void bindIsPressed(final Layer layer, final Consumer<Boolean> handler) {
        layer.bind(hwButton, hwButton.pressedAction(), () -> handler.accept(true));
        layer.bind(hwButton, hwButton.releasedAction(), () -> handler.accept(false));
    }

    public void bindPressed(final Layer layer, final Runnable action) {
        layer.bind(hwButton, hwButton.pressedAction(), action);
    }

    public void bindPressed(final Layer layer, final HardwareActionBindable action) {
        layer.bind(hwButton, hwButton.pressedAction(), action);
    }

    public void bindRelease(final Layer layer, final Runnable action) {
        layer.bind(hwButton, hwButton.releasedAction(), action);
    }

    public void bindLight(final Layer layer, final Supplier<InternalHardwareLightState> supplier) {
        layer.bindLightState(supplier, light);
    }

    public void bindLightPressed(final Layer layer, final Function<Boolean, InternalHardwareLightState> supplier) {
        layer.bindLightState(() -> supplier.apply(hwButton.isPressed().get()), light);
    }

    public void bindLight(final Layer layer, final Function<Boolean, InternalHardwareLightState> pressedCombine) {
        layer.bindLightState(() -> pressedCombine.apply(hwButton.isPressed().get()), light);
    }

    public void bindLightPressed(final Layer layer, final InternalHardwareLightState state,
                                 final InternalHardwareLightState holdState) {
        layer.bindLightState(() -> hwButton.isPressed().get() ? holdState : state, light);
    }

    /**
     * Models following behavior. Pressing and Releasing the button within the given delay time executes the click event.
     * Long Pressing the button invokes the holdAction with true and then the same action with false once released.
     *
     * @param layer       the layer
     * @param clickAction the action invoked if the button is pressed and release in less than the given delay time
     * @param holdAction  action called with true when the delay time expires and with false if released under this condition
     * @param delayTime   the delay time
     */
    public void bindDelayedHold(final Layer layer, final Runnable clickAction, final Consumer<Boolean> holdAction,
                                final long delayTime) {
        layer.bind(hwButton, hwButton.pressedAction(), () -> initiateHold(holdAction, delayTime));
        layer.bind(hwButton, hwButton.releasedAction(), () -> handleDelayedRelease(clickAction, holdAction));
    }

    private void initiateHold(final Consumer<Boolean> holdAction, final long delayTime) {
        recordedDownTime = System.currentTimeMillis();
        currentTimer = new TimedDelayEvent(() -> {
            holdAction.accept(true);
        }, delayTime);
        midiProcessor.queueEvent(currentTimer);
    }

    private void handleDelayedRelease(final Runnable clickAction, final Consumer<Boolean> holdAction) {
        if (currentTimer != null && !currentTimer.isCompleted()) {
            currentTimer.cancel();
            clickAction.run();
            currentTimer = null;
        } else {
            holdAction.accept(false);
        }
    }

    /**
     * Binds the given action to a button. Upon pressing the button the action is immediately executed. However while
     * holding the button, the action repeats after an initial delay. The standard delay time of 400ms and repeat
     * frequency of 50ms are used.
     *
     * @param layer  the layer this is bound to
     * @param action action to be invoked and after a delay repeat
     */
    public void bindRepeatHold(final Layer layer, final Runnable action) {
        layer.bind(hwButton, hwButton.pressedAction(),
                () -> initiateRepeat(action, STD_REPEAT_DELAY, STD_REPEAT_FREQUENCY));
        layer.bind(hwButton, hwButton.releasedAction(), this::cancelEvent);
    }

    public void initiateRepeat(final Runnable action, final int repeatDelay, final int repeatFrequency) {
        action.run();
        currentTimer = new TimeRepeatEvent(action, repeatDelay, repeatFrequency);
        midiProcessor.queueEvent(currentTimer);
    }

    private void cancelEvent() {
        if (currentTimer != null) {
            currentTimer.cancel();
            currentTimer = null;
        }
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/ClickEncoder.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import java.util.function.IntConsumer;

import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.HardwareActionBindable;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extension.controller.api.Parameter;
import com.bitwig.extension.controller.api.RelativeHardwareKnob;
import com.bitwig.extension.controller.api.RelativeHardwareValueMatcher;
import com.bitwig.extension.controller.api.SettableRangedValue;
import com.bitwig.extensions.framework.Layer;

public class ClickEncoder {
    private final RelativeHardwareKnob encoder;
    private final ControllerHost host;
    
    public ClickEncoder(int ccNr, final ControllerHost host, final HardwareSurface surface, MidiIn midiIn) {
        encoder = surface.createRelativeHardwareKnob("ENCODER_" + ccNr);
        this.host = host;
        final RelativeHardwareValueMatcher stepUpMatcher =
            midiIn.createRelativeValueMatcher("(status == 176 && data1 == %d && data2==1)".formatted(ccNr), 1);
        final RelativeHardwareValueMatcher stepDownMatcher =
            midiIn.createRelativeValueMatcher("(status == 176 && data1 == %d && data2==127)".formatted(ccNr), -1);
        
        final RelativeHardwareValueMatcher matcher =
            host.createOrRelativeHardwareValueMatcher(stepDownMatcher, stepUpMatcher);
        encoder.setAdjustValueMatcher(matcher);
        encoder.setStepSize(1);
    }
    
    public void setStepSize(final double value) {
        encoder.setStepSize(value);
    }
    
    public void bindParameter(final Layer layer, final Parameter parameter) {
        final RelativeValueBinding binding = new RelativeValueBinding(encoder, parameter);
        layer.addBinding(binding);
    }
    
    public void bind(final Layer layer, final SettableRangedValue value) {
        final RelativeValueBinding binding = new RelativeValueBinding(encoder, value);
        layer.addBinding(binding);
    }
    
    public void bind(final Layer layer, IntConsumer action) {
        final HardwareActionBindable incAction = host.createAction(() -> action.accept(1), () -> "+");
        final HardwareActionBindable decAction = host.createAction(() -> action.accept(-1), () -> "-");
        layer.bind(encoder, host.createRelativeHardwareControlStepTarget(incAction, decAction));
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/Encoder.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import java.util.function.IntConsumer;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.values.Midi;

public class Encoder {
   private final RelativeHardwareKnob encoder;

   public Encoder(int ccNr, final HardwareSurface surface, MidiIn midiIn) {
      encoder = surface.createRelativeHardwareKnob("ENCODER_" + ccNr);
   
      final String matchExpr = String.format("(status==%d && data1==%d && data2>0)", Midi.CC, ccNr);
      encoder.setAdjustValueMatcher(midiIn.createRelative2sComplementValueMatcher(matchExpr, "data2", 7, 200));
      encoder.setStepSize(0.1);
   }

   public void setStepSize(final double value) {
      encoder.setStepSize(value);
   }

   public void bindParameter(final Layer layer, final Parameter parameter) {
      final RelativeValueBinding binding = new RelativeValueBinding(encoder, parameter);
      layer.addBinding(binding);
   }

   public void bind(final Layer layer, final SettableRangedValue value) {
      final RelativeValueBinding binding = new RelativeValueBinding(encoder, value);
      layer.addBinding(binding);
   }
   
   public void bind(ControllerHost host, final Layer layer, IntConsumer changeAction) {
      final HardwareActionBindable incAction = host.createAction(() -> changeAction.accept(1), () -> "+");
      final HardwareActionBindable decAction = host.createAction(() -> changeAction.accept(-1), () -> "-");
      layer.bind(encoder, host.createRelativeHardwareControlStepTarget(incAction, decAction));
   }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/RelativeValueBinding.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import com.bitwig.extension.controller.api.HardwareBinding;
import com.bitwig.extension.controller.api.RelativeHardwareControlBinding;
import com.bitwig.extension.controller.api.RelativeHardwareKnob;
import com.bitwig.extension.controller.api.SettableRangedValue;
import com.bitwig.extensions.framework.Binding;

public class RelativeValueBinding extends Binding<RelativeHardwareKnob, SettableRangedValue> {

   private HardwareBinding hwBinding;

   public RelativeValueBinding(final RelativeHardwareKnob source, final SettableRangedValue target) {
      super(source, source, target);
   }

   protected RelativeHardwareControlBinding getHardwareBinding() {
      return getTarget().addBinding(getSource());
   }

   public void reset() {
      if (!isActive()) {
         return;
      }
      if (hwBinding != null) {
         hwBinding.removeBinding();
      }
      hwBinding = getHardwareBinding();
   }

   @Override
   protected void deactivate() {
      if (hwBinding != null) {
         hwBinding.removeBinding();
         hwBinding = null;
      }
   }

   @Override
   protected void activate() {
      if (hwBinding != null) {
         hwBinding.removeBinding();
      }
      hwBinding = getHardwareBinding();
   }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/RgbButton.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.novation.commonsmk3.ColorLookup;
import com.bitwig.extensions.framework.values.Midi;

public class RgbButton extends ApcButton {

    public RgbButton(final int channel, final int noteNr, final String name, final HardwareSurface surface,
                     final MidiProcessor midiProcessor) {
        super(channel, noteNr, name, surface, midiProcessor);
        light.state().setValue(RgbLightState.OFF);
        light.setColorToStateFunction(this::colorToState);
        if (channel == 9) {
            light.state().onUpdateHardware(this::updateDrumState);
        } else {
            light.state().onUpdateHardware(this::updateState);
        }
    }

    private InternalHardwareLightState colorToState(final Color color) {
        return RgbLightState.of(ColorLookup.toColor(color.getRed255(), color.getGreen255(), color.getBlue255()));
    }

    private void updateDrumState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof RgbLightState state) {
            midiProcessor.sendMidi(Midi.NOTE_ON | 0x9, midiId, state.getColorIndex());
        } else {
            midiProcessor.sendMidi(Midi.NOTE_ON, midiId, 0);
        }
    }


    private void updateState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof RgbLightState state) {
            midiProcessor.sendMidi(state.getMidiCode(), midiId, state.getColorIndex());
        } else {
            midiProcessor.sendMidi(Midi.NOTE_ON, midiId, 0);
        }
    }

    @Override
    public void refresh() {
        updateState(light.state().currentValue());
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/control/SingleLedButton.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.control;

import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.SingleLedState;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.framework.values.Midi;

public class SingleLedButton extends ApcButton {

    public SingleLedButton(final int noteNr, String name, final HardwareSurface surface,
                           final MidiProcessor midiProcessor) {
        super(0, noteNr, name, surface, midiProcessor);
        light.state().setValue(RgbLightState.OFF);
        light.state().onUpdateHardware(this::updateState);
    }

    private void updateState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof SingleLedState) {
            final SingleLedState state = (SingleLedState) internalHardwareLightState;
            midiProcessor.sendMidi(Midi.NOTE_ON, midiId, state.getCode());
        } else {
            midiProcessor.sendMidi(Midi.NOTE_ON, midiId, 0);
        }
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/led/ColorLookup.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.led;

public class ColorLookup {
    private static final Hsb BLACK_HSB = new Hsb(0, 0, 0);

    public static int toColor(final float r, final float g, final float b) {
        final int rv = (int) Math.floor(r * 255);
        final int gv = (int) Math.floor(g * 255);
        final int bv = (int) Math.floor(b * 255);
        if (rv < 10 && gv < 10 && bv < 10) {
            return 0; // black
        } else if (rv > 230 && gv > 230 && bv > 230) {
            return 3; // white
        } else if (rv == gv && bv == gv) {
            final int bright = rv >> 4;
            if (bright > 7) {
                return 2; // gray
            } else {
                return 1;
            }
        } else {
            final Hsb hsb = ColorLookup.rgbToHsb(rv, gv, bv);
            int hueInd = hsb.hue > 6 ? hsb.hue - 1 : hsb.hue;
            hueInd = Math.min(13, hueInd);
            int color = 5 + hueInd * 4 + 1;
            if (hsb.sat < 8) {
                color -= 2;
            } else if (hsb.bright <= 8) {
                color += 2;
            }
            // return color;
            return adjust(color);
        }
    }

    private static int adjust(final int c) {
        final int rst = (c - 2) % 4;
        if (rst == 0) {
            return c - 1;
        }
        return c;
    }

    public static Hsb rgbToHsb(final float rv, final float gv, final float bv) {
        final float rgb_max = Math.max(Math.max(rv, gv), bv);
        final float rgb_min = Math.min(Math.min(rv, gv), bv);
        final int bright = (int) rgb_max;
        if (bright == 0) {
            return BLACK_HSB; // Black
        }
        final int sat = (int) (255 * (rgb_max - rgb_min) / bright);
        if (sat == 0) {
            return BLACK_HSB; // White
        }
        float hue;
        if (rgb_max == rv) {
            hue = 0 + 43 * (gv - bv) / (rgb_max - rgb_min);
        } else if (rgb_max == gv) {
            hue = 85 + 43 * (bv - rv) / (rgb_max - rgb_min);
        } else {
            hue = 171 + 43 * (rv - gv) / (rgb_max - rgb_min);
        }
        if (hue < 0) {
            hue = 256 + hue;
        }
        return new Hsb((int) Math.floor(hue / 16.0 + 0.3), sat >> 4, bright >> 4);
    }

    public static class Hsb {
        public final int hue;
        public final int sat;
        public final int bright;

        public Hsb(final int hue, final int sat, final int bright) {
            super();
            this.hue = hue;
            this.sat = sat;
            this.bright = bright;
        }

        @Override
        public String toString() {
            final StringBuilder sb = new StringBuilder("Hsb{");
            sb.append("hue=").append(hue);
            sb.append(", sat=").append(sat);
            sb.append(", bright=").append(bright);
            sb.append('}');
            return sb.toString();
        }
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/led/LedBehavior.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.led;

public enum LedBehavior {
    LIGHT_10(0),
    LIGHT_25(1),
    LIGHT_50(2),
    LIGHT_60(3),
    LIGHT_75(4),
    LIGHT_90(5),
    FULL(6),
    PULSE_16(7),
    PULSE_8(8),
    PULSE_4(9),
    PULSE_2(10),
    BLINK_24(11),
    BLINK_16(12),
    BLINK_8(13),
    BLINK_4(14),
    BLINK_2(15);
    final int code;

    LedBehavior(int code) {
        this.code = code;
     }
    
    public int getCode() {
        return code;
    }
    
 }



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/led/RgbLightState.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.led;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extensions.framework.values.Midi;

import java.util.HashMap;
import java.util.Map;

public class RgbLightState extends InternalHardwareLightState {

    private static final Map<Integer, RgbLightState> STATE_MAP = new HashMap<>();

    public static final RgbLightState OFF = new RgbLightState(0);
    public static final RgbLightState WHITE = RgbLightState.of(3);
    public static final RgbLightState WHITE_BRIGHT = RgbLightState.of(3, LedBehavior.FULL);
    public static final RgbLightState WHITE_SEL = RgbLightState.of(3, LedBehavior.PULSE_2);
    public static final RgbLightState WHITE_DIM = RgbLightState.of(1);
    public static final RgbLightState RED = new RgbLightState(5);
    public static final RgbLightState GREEN = new RgbLightState(21);
    public static final RgbLightState RED_FULL = new RgbLightState(5, LedBehavior.FULL);
    public static final RgbLightState RED_DIM = new RgbLightState(5, LedBehavior.LIGHT_10);
    public static final RgbLightState YELLOW_FULL = new RgbLightState(13, LedBehavior.FULL);
    public static final RgbLightState YELLOW_DIM = new RgbLightState(13, LedBehavior.LIGHT_10);
    public static final RgbLightState ORANGE_FULL = new RgbLightState(9, LedBehavior.FULL);
    public static final RgbLightState ORANGE_SEL = new RgbLightState(9, LedBehavior.PULSE_2);
    public static final RgbLightState ORANGE_DIM = new RgbLightState(9, LedBehavior.LIGHT_10);
    public static final RgbLightState GREEN_PLAY = new RgbLightState(21, LedBehavior.PULSE_2);

    public static final RgbLightState MUTE_PLAY_DIM = new RgbLightState(10, LedBehavior.LIGHT_10);
    public static final RgbLightState MUTE_PLAY_FULL = new RgbLightState(10, LedBehavior.FULL);
    public static final RgbLightState SOLO_PLAY_FULL = new RgbLightState(14, LedBehavior.FULL);
    public static final RgbLightState SOLO_PLAY_YELLOW_DIM = new RgbLightState(14, LedBehavior.LIGHT_10);

    private final int colorIndex;
    private final LedBehavior ledBehavior;

    public static RgbLightState of(final int colorIndex) {
        return STATE_MAP.computeIfAbsent(colorIndex | LedBehavior.FULL.getCode() << 8,
                index -> new RgbLightState(colorIndex));
    }

    public static RgbLightState of(final int colorIndex, final LedBehavior behavior) {
        return STATE_MAP.computeIfAbsent(colorIndex | behavior.getCode() << 8,
                index -> new RgbLightState(colorIndex, behavior));
    }

    public RgbLightState behavior(final LedBehavior behavior) {
        if (this.ledBehavior == behavior) {
            return this;
        }
        return of(this.colorIndex, behavior);
    }

    private RgbLightState(final int colorIndex) {
        this(colorIndex, LedBehavior.FULL);
    }

    private RgbLightState(final int colorIndex, final LedBehavior ledBehavior) {
        this.colorIndex = colorIndex;
        this.ledBehavior = ledBehavior;
    }

    public int getColorIndex() {
        return colorIndex;
    }

    public int getMidiCode() {
        return Midi.NOTE_ON | ledBehavior.getCode();
    }

    @Override
    public HardwareLightVisualState getVisualState() {
        if (colorIndex == 0) {
            return null;
        }
        return HardwareLightVisualState.createForColor(Color.fromRGB(255, 0, 0));
    }

    @Override
    public boolean equals(final Object o) {
        if (o instanceof RgbLightState other) {
            return other.colorIndex == colorIndex && other.ledBehavior == ledBehavior;
        }
        return false;
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/led/SingleLedState.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.led;

import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;

public class SingleLedState extends InternalHardwareLightState {
    
    public static final SingleLedState OFF = new SingleLedState(0);
    public static final SingleLedState ON = new SingleLedState(1);
    public static final SingleLedState BLINK = new SingleLedState(2);
    
    private final int code;
    
    private SingleLedState(int code) {
        this.code = code;
    }
    
    public int getCode() {
        return code;
    }
    
    @Override
    public HardwareLightVisualState getVisualState() {
        return null;
    }
    
    @Override
    public boolean equals(final Object o) {
        if(o == this) {
            return true;
        }
        if(o instanceof SingleLedState) {
            return ((SingleLedState)o).code == code;
        }
        return false;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc/common/led/VarSingleLedState.java
================================================
package com.bitwig.extensions.controllers.akai.apc.common.led;

import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;

public class VarSingleLedState extends InternalHardwareLightState {
    
    public static final VarSingleLedState OFF = new VarSingleLedState(0);
    public static final VarSingleLedState LIGHT_10= new VarSingleLedState(1);
    public static final VarSingleLedState LIGHT_25= new VarSingleLedState(2);
    public static final VarSingleLedState LIGHT_50= new VarSingleLedState(3);
    public static final VarSingleLedState LIGHT_60= new VarSingleLedState(4);
    public static final VarSingleLedState LIGHT_75= new VarSingleLedState(5);
    public static final VarSingleLedState LIGHT_90= new VarSingleLedState(6);
    public static final VarSingleLedState FULL= new VarSingleLedState(7);
    public static final VarSingleLedState PULSE_16= new VarSingleLedState(8);
    public static final VarSingleLedState PULSE_8= new VarSingleLedState(9);
    public static final VarSingleLedState PULSE_4= new VarSingleLedState(10);
    public static final VarSingleLedState PULSE_2= new VarSingleLedState(11);
    public static final VarSingleLedState BLINK_24= new VarSingleLedState(12);
    public static final VarSingleLedState BLINK_16= new VarSingleLedState(13);
    public static final VarSingleLedState BLINK_8= new VarSingleLedState(14);
    public static final VarSingleLedState BLINK_4= new VarSingleLedState(15);
    public static final VarSingleLedState BLINK_2= new VarSingleLedState(16);
    
    private final int code;
    
    protected VarSingleLedState(int code) {
        this.code = code;
    }
    
    public int getCode() {
        return code == 0 ? 0 : 1;
    }
    
    public int getChannel() {
        return code == 0 ? 0 : code-1;
    }
    
    @Override
    public HardwareLightVisualState getVisualState() {
        return null;
    }
    
    @Override
    public boolean equals(final Object o) {
        if(o == this) {
            return true;
        }
        if(o instanceof VarSingleLedState) {
            return ((VarSingleLedState)o).code == code;
        }
        return false;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc40_mkii/APC40MKIIControllerExtensionDefinition.java
================================================
package com.bitwig.extensions.controllers.akai.apc40_mkii;

import java.util.UUID;

import com.bitwig.extension.api.PlatformType;
import com.bitwig.extension.controller.AutoDetectionMidiPortNamesList;
import com.bitwig.extension.controller.ControllerExtension;
import com.bitwig.extension.controller.ControllerExtensionDefinition;
import com.bitwig.extension.controller.api.ControllerHost;

public class APC40MKIIControllerExtensionDefinition extends ControllerExtensionDefinition
{
   private final static UUID ID = UUID.fromString("0b134b19-a791-4aa8-8a2f-1fdd2b73c4fc");

   @Override
   public String getName()
   {
      return "APC40 mkII";
   }

   @Override
   public String getVersion()
   {
      return "1.2";
   }

   @Override
   public String getAuthor()
   {
      return "Bitwig";
   }

   @Override
   public UUID getId()
   {
      return ID;
   }

   @Override
   public int getRequiredAPIVersion()
   {
      return 18;
   }

   @Override
   public String getHardwareVendor()
   {
      return "Akai";
   }

   @Override
   public String getHardwareModel()
   {
      return getName();
   }

   @Override
   public String getHelpFilePath()
   {
      return "Controllers/Akai/APC40 MKII.pdf";
   }

   @Override
   public int getNumMidiInPorts()
   {
      return 1;
   }

   @Override
   public int getNumMidiOutPorts()
   {
      return 1;
   }

   @Override
   public ControllerExtension createInstance(final ControllerHost host)
   {
      return new APC40MKIIControllerExtension(this, host);
   }

   @Override
   public void listAutoDetectionMidiPortNames(
      final AutoDetectionMidiPortNamesList list,
      final PlatformType platformType)
   {
      final String[] inputNames = new String[1];
      final String[] outputNames = new String[1];

      switch (platformType)
      {
         case LINUX ->
         {
            inputNames[0] = "APC40 mkII MIDI 1";
            outputNames[0] = "APC40 mkII MIDI 1";
         }
         case WINDOWS, MAC ->
         {
            inputNames[0] = "APC40 mkII";
            outputNames[0] = "APC40 mkII";
         }
      }

      list.add(inputNames, outputNames);
   }

   public static APC40MKIIControllerExtensionDefinition getInstance()
   {
      return mInstance;
   }

   private static final APC40MKIIControllerExtensionDefinition mInstance = new APC40MKIIControllerExtensionDefinition();
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc40_mkii/CrossFadeMode.java
================================================
package com.bitwig.extensions.controllers.akai.apc40_mkii;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extension.controller.api.Track;

class CrossFadeMode extends InternalHardwareLightState
{
    public static final CrossFadeMode A = new CrossFadeMode("A", 0, 1);

    public static final CrossFadeMode B = new CrossFadeMode("B", 1, 2);

    public static final CrossFadeMode AB = new CrossFadeMode("AB", 2, 0);

    public static CrossFadeMode getBestModeForColor(final Color color)
    {
        if (color == null || color.getAlpha() == 0
            || color.getRed() == 0 && color.getGreen() == 0 && color.getBlue() == 0)
            return AB;

        if (B_COLOR.equals(color))
            return B;

        return A;
    }

    public static CrossFadeMode forEnumName(final String name)
    {
        if (name.equals(A.mEnumName))
            return A;
        if (name.equals(B.mEnumName))
            return B;
        return AB;
    }

    public static CrossFadeMode forTrack(final Track track)
    {
        return forEnumName(track.crossFadeMode().get());
    }

    private static CrossFadeMode forIndex(final int index)
    {
        final CrossFadeMode mode = switch (index)
        {
        case 0 -> A;
        case 1 -> B;
        default -> AB;
        };

        assert mode.getIndex() == index;

        return mode;
    }

    private CrossFadeMode(final String enumName, final int index, final int colorIndex)
    {
        mEnumName = enumName;
        mIndex = index;
        mColorIndex = colorIndex;
    }

    public int getIndex()
    {
        return mIndex;
    }

    /** The color value we need to send to the hardware */
    public int getColorIndex()
    {
        return mColorIndex;
    }

    public CrossFadeMode getNext()
    {
        final int index = (mColorIndex + 1) % 3;

        return forIndex(index);
    }

    public String getEnumName()
    {
        return mEnumName;
    }

    @Override
    public HardwareLightVisualState getVisualState()
    {
        if (this == AB)
            return null;

        if (this == A)
            return A_VISUAL_STATE;

        return B_VISUAL_STATE;
    }

    @Override
    public boolean equals(final Object obj)
    {
        return this == obj;
    }

    private final String mEnumName;

    private final int mColorIndex, mIndex;

    private static final Color A_COLOR = Color.fromRGB(1, 0.64, 0);

    private static final Color B_COLOR = Color.fromRGB(0, 0, 1);

    private static final HardwareLightVisualState A_VISUAL_STATE = HardwareLightVisualState
        .createForColor(A_COLOR);

    private static final HardwareLightVisualState B_VISUAL_STATE = HardwareLightVisualState
        .createForColor(B_COLOR);
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc40_mkii/KnobLed.java
================================================
package com.bitwig.extensions.controllers.akai.apc40_mkii;

import com.bitwig.extension.controller.api.MidiOut;

public class KnobLed
{
   public static final int RING_INIT = -1;

   public static final int RING_OFF = 0;

   public static final int RING_SINGLE = 1;

   public static final int RING_VOLUME = 2;

   public static final int RING_PAN = 3;

   public void flush(final MidiOut midiOut, final int msg, final int channel, final int data1)
   {
      if (mRing != mDisplayedRing)
      {
         assert mRing >= 0;
         assert mRing < 128;

         midiOut.sendMidi((msg << 4) | channel, data1 + 8, mRing);
         mDisplayedRing = mRing;
      }

      if (mValue != mDisplayedValue)
      {
         assert mValue >= 0;
         assert mValue < 128;

         midiOut.sendMidi((msg << 4) | channel, data1, mValue);
         mDisplayedValue = mValue;
      }
   }

   public boolean wantsFlush()
   {
      return mRing != mDisplayedRing || mValue != mDisplayedValue;
   }

   public void set(final int value)
   {
      assert value >= 0;
      assert value < 128;

      mValue = Math.min(127, Math.max(0, value));
   }

   public void setDisplayedValue(final int value)
   {
      assert value >= 0;
      assert value < 128;

      mValue = value;
      mDisplayedValue = value;
   }

   public void setRing(final int ring)
   {
      mRing = ring;
   }

   private int mValue = 0;

   private int mDisplayedValue = -1;

   private int mRing = RING_OFF;

   private int mDisplayedRing = RING_INIT;
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc40_mkii/RgbLed.java
================================================
package com.bitwig.extensions.controllers.akai.apc40_mkii;

import com.bitwig.extension.controller.api.HardwareButton;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.MidiOut;
import com.bitwig.extension.controller.api.MultiStateHardwareLight;

class RgbLed
{
   protected RgbLed(
      final HardwareButton button,
      final HardwareSurface surface,
      final int message,
      final int data1,
      final MidiOut midiOut)
   {
      super();
      mMessage = message;
      mData1 = data1;

      mLight = surface.createMultiStateHardwareLight(button.getId() + "-light");
      mLight.setColorToStateFunction(RGBLedState::getBestStateForColor);
      mLight.state().onUpdateHardware(state -> sendLightState(midiOut, (RGBLedState)state));
      button.setBackgroundLight(mLight);
   }

   public MultiStateHardwareLight getLight()
   {
       return mLight;
   }

   private void sendLightState(final MidiOut midiOut, RGBLedState state)
   {
      if (state == null)
         state = RGBLedState.OFF_STATE;
         
      final var color = state.getColor();
      final var blinkColor = state.getBlinkColor();
      final var blinkType = state.getBlinkType();
      
      midiOut.sendMidi(mMessage << 4, mData1, color);

      if (blinkType != RGBLedState.BLINK_NONE)
      {
         midiOut.sendMidi(mMessage << 4, mData1, blinkColor);
         midiOut.sendMidi((mMessage << 4) | blinkType, mData1, color);
      }
      else
      {
         midiOut.sendMidi(mMessage << 4, mData1, color);
      }
   }

   private final MultiStateHardwareLight mLight;

   private final int mMessage, mData1;
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc40_mkii/RGBLedState.java
================================================
package com.bitwig.extensions.controllers.akai.apc40_mkii;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;

class RGBLedState extends InternalHardwareLightState
{
   /** Array of colors that the protocol specifies. */
   private static final Color[] COLORS = new Color[128];

   public static final int COLOR_NONE = 0;

   public static final int COLOR_WHITE = 3;

   public static final int COLOR_RED = 5;

   public static final int COLOR_GREEN = 21;

   public static final int COLOR_YELLOW = 13;

   public static final int COLOR_RECORDING = COLOR_RED;

   public static final int COLOR_PLAYING = COLOR_GREEN;

   public static final int COLOR_PLAYING_QUEUED = COLOR_YELLOW;

   public static final int COLOR_STOPPING = COLOR_NONE;

   public static final int COLOR_SELECTED = COLOR_YELLOW;

   public static final int COLOR_SELECTABLE = 1;

   public static final int BLINK_NONE = 0;

   public static final int BLINK_PLAY_QUEUED = 14;

   public static final int BLINK_ACTIVE = 10;

   public static final int BLINK_RECORD_QUEUED = 13;

   public static final int BLINK_STOP_QUEUED = 13;

   public static final RGBLedState OFF_STATE = new RGBLedState(COLOR_NONE, COLOR_NONE, BLINK_NONE);

   /**
    * Registers a color as defined in the APC 40 mkii MIDI protocol. The color value is the velocity to use
    * for the provided RGB integer color.
    */
   private static void registerColor(final int rgb, final int value)
   {
      assert value >= 0 && value <= 127;
      assert COLORS[value] == null;

      COLORS[value] = createColorForRGBInt(rgb);
   }

   private static Color createColorForRGBInt(final int rgb)
   {
      final int red = (rgb & 0xFF0000) >> 16;
      final int green = (rgb & 0xFF00) >> 8;
      final int blue = rgb & 0xFF;

      return Color.fromRGB255(red, green, blue);
   }

   private static double[] rgbToHsv(final Color color)
   {
      final double[] hsv = new double[3];

      final double r = color.getRed();
      final double g = color.getGreen();
      final double b = color.getBlue();

      final double max = Math.max(r, Math.max(g, b));
      final double min = Math.min(r, Math.min(g, b));
      final double delta = max - min;

      // Calculate hue
      if (delta == 0)
      {
         hsv[0] = 0;
      }
      else if (max == r)
      {
         hsv[0] = (60 * ((g - b) / delta) + 360) % 360;
      }
      else if (max == g)
      {
         hsv[0] = (60 * ((b - r) / delta) + 120) % 360;
      }
      else if (max == b)
      {
         hsv[0] = (60 * ((r - g) / delta) + 240) % 360;
      }

      // Calculate saturation
      hsv[1] = (max == 0) ? 0 : (delta / max);

      // Calculate value
      hsv[2] = max;

      return hsv;
   }

   private static double colorDistance(final Color color1, final Color color2)
   {
      return 0.5 * colorDistanceRGB(color1, color2) + 0.5 * colorDistanceHSV(color1, color2);
   }

   private static double colorDistanceRGB(final Color color1, final Color color2)
   {
      final double r1 = color1.getRed();
      final double g1 = color1.getGreen();
      final double b1 = color1.getBlue();

      final double r2 = color2.getRed();
      final double g2 = color2.getGreen();
      final double b2 = color2.getBlue();

      final double dr = r2 - r1;
      final double dg = g2 - g1;
      final double db = b2 - b1;

      return Math.sqrt(dr * dr + dg * dg + db * db);
   }

   private static double colorDistanceHSV(final Color color1, final Color color2)
   {
      final double[] hsv1 = rgbToHsv(color1);
      final double[] hsv2 = rgbToHsv(color2);

      final double dh = Math.min(Math.abs(hsv1[0] - hsv2[0]), 1 - Math.abs(hsv1[0] - hsv2[0]));
      final double ds = Math.abs(hsv1[1] - hsv2[1]);
      final double dv = Math.abs(hsv1[2] - hsv2[2]);

      return Math.sqrt(dh * dh + ds * ds + dv * dv);
   }

   private static record ColorToIndexCacheEntry(int rgb, int index)
   {
   }

   private static final int colorToRGBInt(final Color color)
   {
      return color.getRed255() << 16 | color.getGreen255() << 8 | color.getBlue255();
   }

   private static final Map<Integer, Integer> HANDPICKED_RGBINT_TO_CLOSEST_COLOR_INDEX = new HashMap<>();

   private static void registerHandpickedClosestColor(final int rgb, final int colorIndex)
   {
      HANDPICKED_RGBINT_TO_CLOSEST_COLOR_INDEX.put(rgb, colorIndex);
   }

   static 
   {
      registerHandpickedClosestColor(0xFF0000, COLOR_RED);
      registerHandpickedClosestColor(0xFF00, COLOR_GREEN);
      registerHandpickedClosestColor(0xFF, 45);
      registerHandpickedClosestColor(0xFFD90F, COLOR_YELLOW);

      registerHandpickedClosestColor(0, 0);

      registerHandpickedClosestColor(14235761, 57);
      registerHandpickedClosestColor(14771857, 107);
      registerHandpickedClosestColor(5526612, 1);

      registerHandpickedClosestColor(14233124, 6);
      registerHandpickedClosestColor(15491415, 5);
      registerHandpickedClosestColor(8026746, 2);

      registerHandpickedClosestColor(16733958, 9);
      registerHandpickedClosestColor(16745278, 12);
      registerHandpickedClosestColor(13224393, 3);

      registerHandpickedClosestColor(14261520, 14);
      registerHandpickedClosestColor(14989134, 13);
      registerHandpickedClosestColor(8817068, 104);

      registerHandpickedClosestColor(7575572, 18);
      registerHandpickedClosestColor(10534988, 17);
      registerHandpickedClosestColor(10713411, 125);

      registerHandpickedClosestColor(40263, 22);
      registerHandpickedClosestColor(4111202, 21);
      registerHandpickedClosestColor(13016944, 124);

      registerHandpickedClosestColor(42644, 34);
      registerHandpickedClosestColor(4444857, 33);
      registerHandpickedClosestColor(5726662, 43);

      registerHandpickedClosestColor(39385, 38);
      registerHandpickedClosestColor(4507903, 37);
      registerHandpickedClosestColor(8686304, 115);

      registerHandpickedClosestColor(9783755, 50);
      registerHandpickedClosestColor(12351216, 49);
   }

   private static final ArrayList<ColorToIndexCacheEntry> RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE = new ArrayList<>();

   public static int getClosestColorIndex(final Color color)
   {
      if (color == null || color.getAlpha() == 0)
         return 0;

      final int rgb = colorToRGBInt(color);

      final Integer handPickedColorIndex = HANDPICKED_RGBINT_TO_CLOSEST_COLOR_INDEX.get(rgb);

      if (handPickedColorIndex != null)
         return handPickedColorIndex;

      final int MAX_CACHE_SIZE = 64;

      synchronized (RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE)
      {
         final int cacheSize = RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE.size();

         for (int i = 0; i < cacheSize; i++)
         {
            final var cacheEntry = RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE.get(i);

            if (cacheEntry.rgb == rgb)
               return cacheEntry.index;
         }

         final int colorIndex = computeClosestColorIndex(color);

         if (cacheSize == MAX_CACHE_SIZE)
            RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE.remove(MAX_CACHE_SIZE - 1);

         RGB_TO_COMPUTED_CLOSEST_COLOR_INDEX_CACHE.add(0, new ColorToIndexCacheEntry(rgb, colorIndex));

         return colorIndex;
      }
   }

   private static int computeClosestColorIndex(final Color color)
   {
      if (color == null || color.getAlpha() == 0)
         return 0;

      int closestIndex = 0;
      double closestDistance = Double.MAX_VALUE;

      for (int i = 0; i < COLORS.length; i++)
      {
         final Color currentColor = COLORS[i];
         final double distance = colorDistance(color, currentColor);

         if (distance == 0)
            return i;

         if (distance < closestDistance)
         {
            closestIndex = i;
            closestDistance = distance;
         }
      }

      return closestIndex;
   }

   public static Color getColorForColorValue(final int colorValue)
   {
      assert colorValue >= 0 && colorValue < COLORS.length;

      if (colorValue < 0 || colorValue >= COLORS.length)
         return COLORS[0];

      return COLORS[colorValue];
   }

   public static RGBLedState getBestStateForColor(final Color color)
   {
      final int colorIndex = getClosestColorIndex(color);

      return new RGBLedState(colorIndex, COLOR_NONE, BLINK_NONE);
   }

   public RGBLedState(final int color, final int blinkColor, final int blinkType)
   {
      super();
      mColor = color;
      mBlinkColor = blinkColor;
      mBlinkType = blinkType;
   }

   public int getColor()
   {
      return mColor;
   }

   public int getBlinkColor()
   {
      return mBlinkColor;
   }

   public int getBlinkType()
   {
      return mBlinkType;
   }

   @Override
   public int hashCode()
   {
      final int prime = 31;
      int result = 1;
      result = prime * result + mBlinkColor;
      result = prime * result + mBlinkType;
      result = prime * result + mColor;
      return result;
   }

   @Override
   public boolean equals(final Object obj)
   {
      if (this == obj)
         return true;
      if (obj == null)
         return false;
      if (getClass() != obj.getClass())
         return false;
      final RGBLedState other = (RGBLedState)obj;
      if (mBlinkColor != other.mBlinkColor)
         return false;
      if (mBlinkType != other.mBlinkType)
         return false;
      if (mColor != other.mColor)
         return false;
      return true;
   }

   @Override
   public HardwareLightVisualState getVisualState()
   {
      final Color color = getColorForColorValue(mColor);

      if (mBlinkType == BLINK_NONE)
         return HardwareLightVisualState.createForColor(color);

      final Color offColor = getColorForColorValue(mBlinkColor);

      if (mBlinkType == BLINK_PLAY_QUEUED)
         return HardwareLightVisualState.createBlinking(color, offColor, 0.2, 0.2);

      return HardwareLightVisualState.createBlinking(color, offColor, 0.5, 0.5);
   }

   private final int mColor, mBlinkColor, mBlinkType;

   static
   {
      registerColor(0x000000, 0);
      registerColor(0x1E1E1E, 1);
      registerColor(0x7F7F7F, 2);
      registerColor(0xFFFFFF, 3);
      registerColor(0xFF4C4C, 4);
      registerColor(0xFF0000, 5);
      registerColor(0x590000, 6);
      registerColor(0x190000, 7);
      registerColor(0xFFBD6C, 8);
      registerColor(0xFF5400, 9);
      registerColor(0x591D00, 10);
      registerColor(0x271B00, 11);
      registerColor(0xFFFF4C, 12);
      registerColor(0xFFFF00, 13);
      registerColor(0x595900, 14);
      registerColor(0x191900, 15);
      registerColor(0x88FF4C, 16);
      registerColor(0x54FF00, 17);
      registerColor(0x1D5900, 18);
      registerColor(0x142B00, 19);
      registerColor(0x4CFF4C, 20);
      registerColor(0x00FF00, 21);
      registerColor(0x005900, 22);
      registerColor(0x001900, 23);
      registerColor(0x4CFF5E, 24);
      registerColor(0x00FF19, 25);
      registerColor(0x00590D, 26);
      registerColor(0x001902, 27);
      registerColor(0x4CFF88, 28);
      registerColor(0x00FF55, 29);
      registerColor(0x00591D, 30);
      registerColor(0x001F12, 31);
      registerColor(0x4CFFB7, 32);
      registerColor(0x00FF99, 33);
      registerColor(0x005935, 34);
      registerColor(0x001912, 35);
      registerColor(0x4CC3FF, 36);
      registerColor(0x00A9FF, 37);
      registerColor(0x004152, 38);
      registerColor(0x001019, 39);
      registerColor(0x4C88FF, 40);
      registerColor(0x0055FF, 41);
      registerColor(0x001D59, 42);
      registerColor(0x000819, 43);
      registerColor(0x4C4CFF, 44);
      registerColor(0x0000FF, 45);
      registerColor(0x000059, 46);
      registerColor(0x000019, 47);
      registerColor(0x874CFF, 48);
      registerColor(0x5400FF, 49);
      registerColor(0x190064, 50);
      registerColor(0x0F0030, 51);
      registerColor(0xFF4CFF, 52);
      registerColor(0xFF00FF, 53);
      registerColor(0x590059, 54);
      registerColor(0x190019, 55);
      registerColor(0xFF4C87, 56);
      registerColor(0xFF0054, 57);
      registerColor(0x59001D, 58);
      registerColor(0x220013, 59);
      registerColor(0xFF1500, 60);
      registerColor(0x993500, 61);
      registerColor(0x795100, 62);
      registerColor(0x436400, 63);
      registerColor(0x033900, 64);
      registerColor(0x005735, 65);
      registerColor(0x00547F, 66);
      registerColor(0x0000FF, 67);
      registerColor(0x00454F, 68);
      registerColor(0x2500CC, 69);
      registerColor(0x7F7F7F, 70);
      registerColor(0x202020, 71);
      registerColor(0xFF0000, 72);
      registerColor(0xBDFF2D, 73);
      registerColor(0xAFED06, 74);
      registerColor(0x64FF09, 75);
      registerColor(0x108B00, 76);
      registerColor(0x00FF87, 77);
      registerColor(0x00A9FF, 78);
      registerColor(0x002AFF, 79);
      registerColor(0x3F00FF, 80);
      registerColor(0x7A00FF, 81);
      registerColor(0xB21A7D, 82);
      registerColor(0x402100, 83);
      registerColor(0xFF4A00, 84);
      registerColor(0x88E106, 85);
      registerColor(0x72FF15, 86);
      registerColor(0x00FF00, 87);
      registerColor(0x3BFF26, 88);
      registerColor(0x59FF71, 89);
      registerColor(0x38FFCC, 90);
      registerColor(0x5B8AFF, 91);
      registerColor(0x3151C6, 92);
      registerColor(0x877FE9, 93);
      registerColor(0xD31DFF, 94);
      registerColor(0xFF005D, 95);
      registerColor(0xFF7F00, 96);
      registerColor(0xB9B000, 97);
      registerColor(0x90FF00, 98);
      registerColor(0x835D07, 99);
      registerColor(0x392b00, 100);
      registerColor(0x144C10, 101);
      registerColor(0x0D5038, 102);
      registerColor(0x15152A, 103);
      registerColor(0x16205A, 104);
      registerColor(0x693C1C, 105);
      registerColor(0xA8000A, 106);
      registerColor(0xDE513D, 107);
      registerColor(0xD86A1C, 108);
      registerColor(0xFFE126, 109);
      registerColor(0x9EE12F, 110);
      registerColor(0x67B50F, 111);
      registerColor(0x1E1E30, 112);
      registerColor(0xDCFF6B, 113);
      registerColor(0x80FFBD, 114);
      registerColor(0x9A99FF, 115);
      registerColor(0x8E66FF, 116);
      registerColor(0x404040, 117);
      registerColor(0x757575, 118);
      registerColor(0xE0FFFF, 119);
      registerColor(0xA00000, 120);
      registerColor(0x350000, 121);
      registerColor(0x1AD000, 122);
      registerColor(0x074200, 123);
      registerColor(0xB9B000, 124);
      registerColor(0x3F3100, 125);
      registerColor(0xB35F00, 126);
      registerColor(0x4B1502, 127);
   }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/Apc64CcAssignments.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

public enum Apc64CcAssignments {
    SCENE_BUTTON_BASE(0x70, true), //
    GRID_BASE(0x0, true),
    STRIP_TOUCH(0x52, true),
    TRACKS_BASE(0x64, true),
    TRACK_CONTROL_BASE(0x40, true),
    NAV_LEFT(0x60),
    NAV_RIGHT(0x61),
    NAV_DOWN(0x5E),
    NAV_UP(0x5F),
    MODE_REC(0x6C),
    MODE_MUTE(0x6D),
    MODE_SOLO(0x6E),
    MODE_STOP(0x6F),
    STRIP_DEVICE(0x79),
    STRIP_VOLUME(0x7A),
    STRIP_PAN(0x7B),
    STRIP_SENDS(0x7C),
    STRIP_CHANNEL(0x7D),
    STRIP_OFF(0x7E),
    CLEAR(0x49),
    DUPLICATE(0x4A),
    FIXED(0x4C),
    QUANTIZE(0x4B),
    UNDO(0x4D),
    TEMPO(0x48),
    SHIFT(0x78),
    PLAY(0x5B),
    STOP(0x5D),
    REC(0x5C);
    
    private int stateId;
    private boolean isBaseStart;
    
    Apc64CcAssignments(final int stateId) {
        this(stateId, false);
    }
    Apc64CcAssignments(final int stateId, boolean isBaseStart) {
        this.isBaseStart = isBaseStart;
        this.stateId = stateId;
    }
    
    public int getStateId() {
        return stateId;
    }
    
    public boolean isBaseStart() {
        return isBaseStart;
    }
    
    public boolean isSingle() {
        return !isBaseStart;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/Apc64Extension.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.ControllerExtension;
import com.bitwig.extension.controller.api.Application;
import com.bitwig.extension.controller.api.ClipLauncherSlot;
import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extension.controller.api.MidiOut;
import com.bitwig.extension.controller.api.NoteInput;
import com.bitwig.extension.controller.api.Project;
import com.bitwig.extension.controller.api.Track;
import com.bitwig.extension.controller.api.Transport;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc.common.led.VarSingleLedState;
import com.bitwig.extensions.controllers.akai.apc64.control.SingleLedButton;
import com.bitwig.extensions.controllers.akai.apc64.layer.OverviewLayer;
import com.bitwig.extensions.controllers.akai.apc64.layer.PadLayer;
import com.bitwig.extensions.controllers.akai.apc64.layer.SessionLayer;
import com.bitwig.extensions.controllers.akai.apc64.layer.TrackAndSceneLayer;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;
import com.bitwig.extensions.framework.di.Context;
import com.bitwig.extensions.framework.values.FocusMode;

import java.time.LocalDateTime;

public class Apc64Extension extends ControllerExtension {
    private static ControllerHost debugHost;
    private HardwareSurface surface;
    private Apc64MidiProcessor midiProcessor;
    private Layer mainLayer;
    private Layer shiftLayer;
    private Transport transport;
    private ViewControl viewControl;
    private FocusClip focusClip;
    private Project project;
    private SessionLayer sessionLayer;
    private OverviewLayer overviewLayer;
    private ApcPreferences preferences;
    private TrackAndSceneLayer sceneAndTrackLayer;
    private PadLayer padLayer;
    private ModifierStates modifierSection;

    public static void println(final String format, final Object... args) {
        if (debugHost != null) {
            final LocalDateTime now = LocalDateTime.now();
            debugHost.println(format.formatted(args));
        }
    }

    protected Apc64Extension(final Apc64ExtensionDefinition definition, final ControllerHost host) {
        super(definition, host);
    }

    @Override
    public void init() {
        debugHost = getHost();
        this.project = getHost().getProject();
        final Context diContext = new Context(this);
        mainLayer = new Layer(diContext.getService(Layers.class), "MAIN_LAYER");
        surface = diContext.getService(HardwareSurface.class);
        initMidi(diContext);
        sessionLayer = diContext.create(SessionLayer.class);
        sceneAndTrackLayer = diContext.create(TrackAndSceneLayer.class);
        overviewLayer = diContext.create(OverviewLayer.class);
        shiftLayer = new Layer(diContext.getService(Layers.class), "SHIFT_LAYER");
        viewControl = diContext.getService(ViewControl.class);
        modifierSection = diContext.getService(ModifierStates.class);

        initMainSection(diContext);
        initTransport(diContext);
        midiProcessor.setHwElements(diContext.getService(HardwareElements.class));
        focusClip = diContext.getService(FocusClip.class);
        preferences = diContext.getService(ApcPreferences.class);
        padLayer = diContext.getService(PadLayer.class);
        sessionLayer.activate();
        sceneAndTrackLayer.activate();
        diContext.activate();
        mainLayer.setIsActive(true);
        midiProcessor.addModeChangeListener(this::handleModeChange);
    }

    private void handleModeChange(final PadMode mode) {
        sessionLayer.setIsActive(mode == PadMode.SESSION);
        overviewLayer.setIsActive(mode == PadMode.OVERVIEW);
        padLayer.setIsActive(mode.isKeyRelated());
    }

    private void initMainSection(final Context context) {
        final HardwareElements hwElements = context.getService(HardwareElements.class);
        final Application application = context.getService(Application.class);

        final SingleLedButton shiftButton = hwElements.getButton(Apc64CcAssignments.SHIFT);
        shiftButton.bindIsPressed(mainLayer, shiftActive -> {
            modifierSection.setShift(shiftActive);
            shiftLayer.setIsActive(shiftActive);
            if (preferences.useShiftForAltMode()) {
                modifierSection.getAltActive().set(shiftActive);
            }
        });

        final SingleLedButton clearButton = hwElements.getButton(Apc64CcAssignments.CLEAR);
        clearButton.bindIsPressed(mainLayer, pressed -> modifierSection.setClear(pressed));
        clearButton.bindLightPressed(mainLayer,
                pressed -> pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10);

        final SingleLedButton duplicateButton = hwElements.getButton(Apc64CcAssignments.DUPLICATE);
        duplicateButton.bindIsPressed(mainLayer, this::handleDuplicatePressed);
        duplicateButton.bindLightPressed(mainLayer,
                pressed -> pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10);

        application.canUndo().markInterested();
        application.canRedo().markInterested();

        final SingleLedButton undoButton = hwElements.getButton(Apc64CcAssignments.UNDO);
        undoButton.bindPressed(mainLayer, () -> application.undo());
        undoButton.bindLightPressed(mainLayer, pressed -> {
            if (application.canUndo().get()) {
                return pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_60;
            }
            return VarSingleLedState.OFF;
        });
        undoButton.bindPressed(shiftLayer, () -> application.redo());
        undoButton.bindLightPressed(shiftLayer, pressed -> {
            if (application.canRedo().get()) {
                return pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_60;
            }
            return VarSingleLedState.OFF;
        });
    }


    private void handleDuplicatePressed(final boolean pressed) {
        modifierSection.setDuplicate(pressed);
        if (padLayer.isActive() && modifierSection.isShift() & pressed) {
            padLayer.duplicateContent();
        }
    }

    private void initTransport(final Context diContext) {
        final HardwareElements hwElements = diContext.getService(HardwareElements.class);
        final FocusClip focusClip = diContext.getService(FocusClip.class);
        transport = diContext.getService(Transport.class);
        transport.isPlaying().markInterested();
        transport.isArrangerRecordEnabled().markInterested();
        transport.isClipLauncherOverdubEnabled().markInterested();
        transport.isArrangerOverdubEnabled().markInterested();

        final SingleLedButton playButton = hwElements.getButton(Apc64CcAssignments.PLAY);
        playButton.bindPressed(mainLayer, () -> transport.play());
        playButton.bindLight(mainLayer,
                () -> transport.isPlaying().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10);

        final SingleLedButton stopButton = hwElements.getButton(Apc64CcAssignments.STOP);
        final Track rootTrack = getHost().getProject().getRootTrackGroup();
        stopButton.bindPressed(mainLayer, () -> transport.stop());
        stopButton.bindLight(mainLayer,
                () -> transport.isPlaying().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10);
        stopButton.bindPressed(shiftLayer, () -> rootTrack.stop());

        final SingleLedButton recButton = hwElements.getButton(Apc64CcAssignments.REC);
        recButton.bindPressed(mainLayer, () -> handleRecordButton(transport, focusClip));
        recButton.bindLight(mainLayer, () -> recordActive(transport));
        recButton.bindPressed(shiftLayer, () -> handleRecordButtonShift(transport));
        recButton.bindLight(mainLayer, () -> recordActiveShift(transport));
    }

    private void handleRecordButton(final Transport transport, final FocusClip focusClip) {
        if (preferences.getRecordFocusMode() == FocusMode.LAUNCHER) {
            focusClip.invokeRecord();
        } else {
            if (transport.isPlaying().get()) {
                transport.isArrangerRecordEnabled().toggle();
            } else {
                transport.isArrangerRecordEnabled().set(true);
                transport.play();
            }
        }
    }

    private void handleRecordButtonShift(final Transport transport) {
        if (preferences.getRecordFocusMode() == FocusMode.LAUNCHER) {
            transport.isClipLauncherOverdubEnabled().toggle();
        } else {
            transport.isArrangerOverdubEnabled().toggle();
        }
    }

    private VarSingleLedState recordActive(final Transport transport) {
        if (preferences.getRecordFocusMode() == FocusMode.LAUNCHER) {
            return transport.isClipLauncherOverdubEnabled().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10;
        }
        return transport.isArrangerRecordEnabled().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10;
    }

    private VarSingleLedState recordActiveShift(final Transport transport) {
        if (preferences.getRecordFocusMode() == FocusMode.LAUNCHER) {
            return transport.isClipLauncherOverdubEnabled().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10;
        }
        return transport.isArrangerOverdubEnabled().get() ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10;
    }

    protected void initMidi(final Context diContext) {
        final ControllerHost host = diContext.getService(ControllerHost.class);
        final MidiIn midiIn = host.getMidiInPort(0);
        final MidiIn midiIn2 = host.getMidiInPort(1);
//        midiIn2.setMidiCallback((msg, d1,d2)-> {
//            Apc64Extension.println("IN2 = %02X %02X %02X",msg,d1,d2);
//        });
        final MidiOut midiOut = host.getMidiOutPort(0);
        midiProcessor = new Apc64MidiProcessor(host, midiIn, midiOut, diContext.getService(ModifierStates.class));
        diContext.registerService(MidiProcessor.class, midiProcessor);
        diContext.registerService(Apc64MidiProcessor.class, midiProcessor);
        final NoteInput noteInput = midiIn2.createNoteInput("MIDI", "8?????", "9?????", "A?????", "D?????", "B?????");
        noteInput.setShouldConsumeEvents(true);
        midiProcessor.setPrintToClipSeqConsumer(this::handlePrintToClip);
        midiProcessor.start();
    }

    int ptcCount = 1;

    private void handlePrintToClip(final PrintToClipSeq printToClipSeq) {
        if (printToClipSeq.hasNotes()) {
            focusClip.focusOnNextEmpty(slot -> {
                if (slot.exists().get()) {
                    createClipFromPrint(printToClipSeq, slot);
                } else {
                    project.createScene();
                    getHost().scheduleTask(() -> {
                        createClipFromPrint(printToClipSeq, slot);
                    }, 40);
                }
            });
        }
    }

    private void createClipFromPrint(final PrintToClipSeq printToClipSeq, final ClipLauncherSlot slot) {
        slot.select();
        slot.showInEditor();
        slot.createEmptyClip(4);
        getHost().scheduleTask(() -> printToClipSeq.applyToClip(viewControl.getCursorClip(), ptcCount++), 40);
    }

    @Override
    public void flush() {
        surface.updateHardware();
    }

    @Override
    public void exit() {
        midiProcessor.exitSessionMode();
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/Apc64ExtensionDefinition.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.api.PlatformType;
import com.bitwig.extension.controller.AutoDetectionMidiPortNamesList;
import com.bitwig.extension.controller.ControllerExtensionDefinition;
import com.bitwig.extension.controller.api.ControllerHost;

import java.util.UUID;

public class Apc64ExtensionDefinition extends ControllerExtensionDefinition {
   private static final UUID DRIVER_ID = UUID.fromString("bc2cae98-42ed-45ef-a191-aef1dfd4e00d");

   public Apc64ExtensionDefinition() {
   }

   @Override
   public String getName() {
      return "APC64";
   }

   @Override
   public String getAuthor() {
      return "Bitwig";
   }

   @Override
   public String getVersion() {
      return "1.0";
   }

   @Override
   public UUID getId() {
      return DRIVER_ID;
   }

   @Override
   public String getHardwareVendor() {
      return "Akai";
   }

   @Override
   public String getHardwareModel() {
      return "APC64";
   }

   @Override
   public int getRequiredAPIVersion() {
      return 18;
   }

   @Override
   public int getNumMidiInPorts() {
      return 2;
   }

   @Override
   public int getNumMidiOutPorts() {
      return 1;
   }

   @Override
   public String getHelpFilePath() {
      return "Controllers/Akai/AKAI APC64.pdf";
   }

   // MIDIOUT2 (APC64)
   // MIDIIN2 (APC64)
   @Override
   public void listAutoDetectionMidiPortNames(final AutoDetectionMidiPortNamesList list,
                                              final PlatformType platformType) {
      if (platformType == PlatformType.WINDOWS) {
         list.add(new String[]{"APC64", "MIDIIN2 (APC64)"}, new String[]{"APC64"});
      } else if (platformType == PlatformType.MAC) {
         list.add(new String[]{"APC64 DAW (APC64)", "APC64 Notes (APC64)"}, new String[]{"APC64 DAW (APC64)"});
      } else if (platformType == PlatformType.LINUX) {
         list.add(new String[]{"APC64 DAW (APC64)", "APC64 Notes (APC64)"}, new String[]{"APC64 DAW (APC64)"});
      }
   }

   @Override
   public Apc64Extension createInstance(final ControllerHost host) {
      return new Apc64Extension(this, host);
   }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/Apc64MidiProcessor.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.function.Consumer;
import java.util.function.IntConsumer;

import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extension.controller.api.MidiOut;
import com.bitwig.extension.controller.api.NoteInput;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.framework.time.TimedEvent;
import com.bitwig.extensions.framework.values.BooleanValueObject;

public class Apc64MidiProcessor implements MidiProcessor {
    private static final String MODE_CHANGE_MSG = "f0470053190001";
    
    private static final String DEVICE_VALUE = "f07e00060247530019010";
    
    //2F0 47 00 53 19 00 01 02 F7
    public static final String PRINT_TO_CLIP_HEAD = "f0470053200002";
    public static final String PRINT_TO_CLIP_TAIL = "f0470053220000f7";
    public static final String PRINT_TO_CLIP_BODY = "f047005321";
    private static final String TEXT_PREFIX = "F0 47 00 53 10 00 ";
    protected final MidiIn midiIn;
    protected final MidiOut midiOut;
    protected final NoteInput noteInput;
    protected final Queue<TimedEvent> timedEvents = new ConcurrentLinkedQueue<>();
    protected final ControllerHost host;
    protected List<Consumer<PadMode>> modeChangeListeners = new ArrayList<>();
    private final int[] noteState = new int[128];
    private final int[] noteValueState = new int[128];
    private HardwareElements hwElements;
    private final BooleanValueObject shiftMode;
    private final BooleanValueObject clearMode;
    private Consumer<PrintToClipSeq> printToClipSeqConsumer;
    private PrintToClipSeq currentPrintToClip;
    private boolean sessionModeState = false;
    private boolean initState = true;
    private PadMode currentMode = PadMode.SESSION;
    
    public Apc64MidiProcessor(final ControllerHost host, final MidiIn midiIn, final MidiOut midiOut,
        final ModifierStates modifierStates) {
        this.host = host;
        this.midiIn = midiIn;
        this.midiOut = midiOut;
        noteInput = midiIn.createNoteInput("MIDI", "86????", "96????", "A?????", "D?????");
        setupNoteInput();
        Arrays.fill(noteState, 0);
        Arrays.fill(noteValueState, 0);
        this.shiftMode = modifierStates.getShiftActive();
        this.clearMode = modifierStates.getClearActive();
        midiIn.setMidiCallback(this::handleMidiIn);
        midiIn.setSysexCallback(this::handleSysEx);
    }
    
    private void setupNoteInput() {
        noteInput.setShouldConsumeEvents(true);
        final Integer[] noAssignTable = new Integer[128];
        Arrays.fill(noAssignTable, Integer.valueOf(-1));
        noteInput.setKeyTranslationTable(noAssignTable);
    }
    
    @Override
    public NoteInput createNoteInput(final String name, final String... mask) {
        return midiIn.createNoteInput(name, mask);
    }
    
    @Override
    public void sendMidi(final int status, final int val1, final int val2) {
        midiOut.sendMidi(status, val1, val2);
        noteState[val1] = status & 0xF;
        noteValueState[val1] = val2;
    }
    
    public void setHwElements(final HardwareElements elements) {
        this.hwElements = elements;
    }
    
    public void restoreState() {
        if (hwElements == null) {
            return;
        }
        hwElements.invokeRefresh();
        //        for (int i = 0; i < noteState.length; i++) {
        //            if (noteState[i] != -1) {
        //                midiOut.sendMidi(0x90 | noteState[i], i, noteValueState[i]);
        //            }
        //        }
    }
    
    @Override
    public void start() {
        midiOut.sendSysex("F0 47 00 53 1B 00 01 00 F7");
        midiOut.sendSysex("F0 47 00 53 19 00 01 00 F7");
        midiOut.sendSysex("F0 7E 7F 06 01 F7");
        host.scheduleTask(this::handlePing, 50);
    }
    
    public NoteInput getNoteInput() {
        return noteInput;
    }
    
    public void setDrumMode(final boolean drumMode) {
        if (drumMode) {
            enterSessionMode();
            midiOut.sendSysex("F0 47 00 53 1B 00 01 01 F7");
            activateDawMode(true);
        } else {
            midiOut.sendSysex("F0 47 00 53 1B 00 01 00 F7");
            midiOut.sendSysex("F0 47 00 53 19 00 01 02 F7");
            exitSessionMode();
        }
    }
    
    
    public boolean isSessionModeState() {
        return sessionModeState;
    }
    
    public boolean modeHasTextControl() {
        return currentMode.hasLocalControl();
    }
    
    public void exitSessionMode() {
        if (sessionModeState) {
            activateDawMode(false);
            sessionModeState = false;
        }
    }
    
    public void enterSessionMode() {
        if (!sessionModeState) {
            activateDawMode(true);
            sessionModeState = true;
        }
    }
    
    public void activateDawMode(final boolean active) {
        midiOut.sendSysex("F0 47 00 53 1C 00 01 %02X F7".formatted(active ? 1 : 0));
    }
    
    private void handlePing() {
        if (!timedEvents.isEmpty()) {
            for (final TimedEvent event : timedEvents) {
                event.process();
                if (event.isCompleted()) {
                    timedEvents.remove(event);
                }
            }
        }
        host.scheduleTask(this::handlePing, 50);
    }
    
    public void queueEvent(final TimedEvent event) {
        timedEvents.add(event);
    }
    
    public MidiIn getMidiIn() {
        return midiIn;
    }
    
    public void setPrintToClipSeqConsumer(final Consumer<PrintToClipSeq> printToClipSeqConsumer) {
        this.printToClipSeqConsumer = printToClipSeqConsumer;
    }
    
    public void addModeChangeListener(final Consumer<PadMode> modeChangeListener) {
        this.modeChangeListeners.add(modeChangeListener);
    }
    
    @Override
    public void setModeChangeListener(final IntConsumer modeChangeListener) {
        // nothing to do
    }
    
    private void handleMidiIn(final int status, final int data1, final int data2) {
        //Apc64Extension.println("MIDI => %02X %02X %02X", status, data1, data2);
    }
    
    public BooleanValueObject getShiftMode() {
        return shiftMode;
    }
    
    public BooleanValueObject getClearMode() {
        return clearMode;
    }
    
    // Text  F0 47 00 53 10 00 0A 00 20 31 2D 4D 49 44 49 20 00 F7
    // 1-MIDI
    // Text  F0 47 00 53 10 00 0A 00 41 42 43 44 61 31 32 33 00 F7
    // ABCDa123
    // Confirmation F0 7E 00 06 02 47 53 00 19 01 01 00 0E 00 00 00 00 00 41 34 32 33 30 37 32 35 37 34 30 32 37 31
    // 31 00 F7
    
    protected void handleSysEx(final String sysExString) {
        //Apc64Extension.println("SysEx = %s  mode=%s", sysExString, sysExString.startsWith(MODE_CHANGE_MSG));
        if (sysExString.startsWith(DEVICE_VALUE)) {
            Apc64Extension.println("#### Connect to APC #### ");
            initState = false;
            enterSessionMode();
        } else if (sysExString.startsWith(MODE_CHANGE_MSG)) {
            final int mode =
                Integer.parseInt(sysExString.substring(MODE_CHANGE_MSG.length(), MODE_CHANGE_MSG.length() + 2), 16);
            handleModeChange(mode);
        } else if (sysExString.startsWith(PRINT_TO_CLIP_HEAD)) {
            final String value = sysExString.substring(PRINT_TO_CLIP_HEAD.length(), sysExString.length() - 2);
            final int length = fromHexValue(value);
            currentPrintToClip = new PrintToClipSeq(length);
        } else if (sysExString.startsWith(PRINT_TO_CLIP_BODY)) {
            final String data = sysExString.substring(PRINT_TO_CLIP_BODY.length() + 2, sysExString.length() - 4);
            final int headValue =
                fromHexValue(sysExString.substring(PRINT_TO_CLIP_BODY.length(), PRINT_TO_CLIP_BODY.length() + 2));
            currentPrintToClip.addNoteData(data);
            currentPrintToClip.setHeadValue(headValue);
        } else if (sysExString.startsWith(PRINT_TO_CLIP_TAIL)) {
            if (printToClipSeqConsumer != null) {
                printToClipSeqConsumer.accept(currentPrintToClip);
            }
        } else {
            //Apc64Extension.println("Unknown SysEx = %s", sysExString);
        }
    }
    
    private void handleModeChange(final int mode) {
        if (initState) {
            return;
        }
        currentMode = PadMode.fromId(mode);
        //Apc64Extension.println(" MODE =%d ==> %s", mode, currentMode);
        
        if (currentMode.hasLocalControl()) {
            //Apc64Extension.println(" DAW MODE IN %s", sessionModeState);
            activateDawMode(true);
            sessionModeState = true;
            restoreState();
        } else {
            exitSessionMode();
        }
        modeChangeListeners.forEach(listener -> listener.accept(currentMode));
    }
    
    private int fromHexValue(final String hex) {
        if (hex.length() == 4) {
            final int v1 = Integer.parseInt(hex.substring(0, 2), 16);
            final int v2 = Integer.parseInt(hex.substring(2, 4), 16);
            return (v1 << 7) | v2;
        }
        if (hex.length() < 3) {
            return Integer.parseInt(hex, 16);
        }
        return 0;
    }
    
    public void sendText(final int row, final String text) {
        final StringBuilder sb = new StringBuilder(TEXT_PREFIX);
        final int len = Math.min(14, Math.max(3, text.length()));
        sb.append("%02X ".formatted(len + 2));
        sb.append("%02X ".formatted(row));
        final String asciiText = StringUtil.toAsciiDisplay(text, len);
        for (int i = 0; i < len; i++) {
            if (i < asciiText.length()) {
                sb.append("%02X ".formatted((int) asciiText.charAt(i)));
            } else {
                sb.append("20 ");
            }
        }
        sb.append("00 ");
        sb.append("F7");
        //Apc64Extension.println(" SEND TEXT %d => %s", row, text);
        midiOut.sendSysex(sb.toString());
    }
    
    
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/ApcPreferences.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.Application;
import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.DocumentState;
import com.bitwig.extension.controller.api.Preferences;
import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extension.controller.api.SettableEnumValue;
import com.bitwig.extensions.controllers.akai.apc.common.OrientationFollowType;
import com.bitwig.extensions.controllers.akai.apc.common.PanelLayout;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.values.FocusMode;
import com.bitwig.extensions.framework.values.ValueObject;

@Component
public class ApcPreferences {
    
    private final ValueObject<OrientationFollowType> orientationFollow;
    private final ValueObject<PanelLayout> panelLayout = new ValueObject<>(PanelLayout.VERTICAL);
    private final SettableBooleanValue altModeWithShift;
    private final SettableEnumValue recordButtonAssignment;
    private final SettableEnumValue gridLayoutSettings;
    private PanelLayout bitwigPanelLayout;
    private FocusMode recordFocusMode = FocusMode.LAUNCHER;
    
    public ApcPreferences(final ControllerHost host, final Application application) {
        final Preferences preferences = host.getPreferences(); // THIS
        orientationFollow = new ValueObject<>(OrientationFollowType.AUTOMATIC);
        gridLayoutSettings = preferences.getEnumSetting("Orientation determined by", "Grid Layout", new String[] {
                OrientationFollowType.AUTOMATIC.getLabel(), //
                OrientationFollowType.FIXED_VERTICAL.getLabel(), //
                OrientationFollowType.FIXED_HORIZONTAL.getLabel()
            }, //
            OrientationFollowType.FIXED_VERTICAL.getLabel());
        gridLayoutSettings.addValueObserver(newValue -> orientationFollow.set(OrientationFollowType.toType(newValue)));
        application.panelLayout().addValueObserver(this::handlePanelLayoutChanged);
        altModeWithShift = preferences.getBooleanSetting("Use as ALT trigger modifier", "Shift Button", true);
        altModeWithShift.markInterested();
        orientationFollow.addValueObserver((newValue -> {
            determinePanelLayout(orientationFollow.get());
        }));
        final DocumentState documentState = host.getDocumentState(); // THIS
        recordButtonAssignment = documentState.getEnumSetting("Record Button assignment", //
            "Transport", new String[] {FocusMode.LAUNCHER.getDescriptor(), FocusMode.ARRANGER.getDescriptor()},
            recordFocusMode.getDescriptor());
        recordButtonAssignment.addValueObserver(value -> {
            recordFocusMode = FocusMode.toMode(value);
        });
    }
    
    private void handlePanelLayoutChanged(final String layout) {
        if (layout.equals("MIX")) {
            bitwigPanelLayout = PanelLayout.VERTICAL;
        } else if (layout.equals("ARRANGE")) {
            bitwigPanelLayout = PanelLayout.HORIZONTAL;
        } else {
            bitwigPanelLayout = PanelLayout.VERTICAL;
        }
        determinePanelLayout(orientationFollow.get());
    }
    
    public SettableEnumValue getGridLayoutSettings() {
        return gridLayoutSettings;
    }
    
    public SettableBooleanValue getAltModeWithShift() {
        return altModeWithShift;
    }
    
    public boolean useShiftForAltMode() {
        return altModeWithShift.get();
    }
    
    public FocusMode getRecordFocusMode() {
        return recordFocusMode;
    }
    
    public ValueObject<PanelLayout> getPanelLayout() {
        return panelLayout;
    }
    
    private void determinePanelLayout(final OrientationFollowType followType) {
        if (followType == OrientationFollowType.FIXED_VERTICAL) {
            panelLayout.set(PanelLayout.VERTICAL);
        } else if (followType == OrientationFollowType.FIXED_HORIZONTAL) {
            panelLayout.set(PanelLayout.HORIZONTAL);
        } else {
            panelLayout.set(bitwigPanelLayout);
        }
    }
    
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/DeviceControl.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.framework.values.BasicStringValue;
import com.bitwig.extensions.framework.values.IntValueObject;

import java.util.function.Consumer;

public class DeviceControl {
    private final CursorRemoteControlsPage deviceRemotePages;
    private final CursorRemoteControlsPage trackRemotes;
    private final CursorRemoteControlsPage projectRemotes;
    private final PinnableCursorDevice cursorDevice;
    private final PinnableCursorDevice primaryDevice;
    private final DrumPadBank drumPadBank;
    private Focus currentFocus = Focus.DEVICE;
    private final BasicStringValue deviceName = new BasicStringValue("");
    private final BasicStringValue pageName = new BasicStringValue("");
    private String[] devicePageNames = new String[]{};
    private String deviceRawName = "";
    private int devicePageIndex = 0;
    private String[] trackRemotePageNames = new String[]{};
    private int trackRemotePageIndex = 0;
    private String[] projectRemotePageNames = new String[]{};
    private int projectRemotePageIndex = 0;
    private Consumer<Focus> focusListener = null;
    private String padRawName = "";
    private final IntValueObject selectedPadIndex = new IntValueObject(-1, -1, 15);

    public enum Focus {
        DEVICE,
        TRACK,
        PROJECT
    }

    public DeviceControl(final CursorTrack cursorTrack, final Track rootTrack) {
        cursorDevice = cursorTrack.createCursorDevice();
        cursorDevice.hasDrumPads().markInterested();
        cursorDevice.name().addValueObserver(name -> {
            deviceRawName = name.isBlank() ? "<No Device>" : name;
            if (currentFocus == Focus.DEVICE) {
                deviceName.set(deviceRawName);
            }
        });
        cursorDevice.hasNext().markInterested();
        cursorDevice.hasPrevious().markInterested();
        cursorDevice.hasLayers().markInterested();
        cursorDevice.hasSlots().markInterested();
        cursorDevice.slotNames().markInterested();

        deviceRemotePages = cursorDevice.createCursorRemoteControlsPage(8);
        deviceRemotePages.pageNames().addValueObserver(names -> {
            devicePageNames = names;
            applyCurrentValues(Focus.DEVICE);
        });
        deviceRemotePages.selectedPageIndex().addValueObserver(index -> {
            devicePageIndex = index;
            applyCurrentValues(Focus.DEVICE);
        });
        deviceRemotePages.setHardwareLayout(HardwareControlType.SLIDER, 8);
        primaryDevice = cursorTrack.createCursorDevice("drumdetection", "Pad Device", 8,
                CursorDeviceFollowMode.FIRST_INSTRUMENT);
        primaryDevice.hasDrumPads().markInterested();
        primaryDevice.exists().markInterested();

        trackRemotes = cursorTrack.createCursorRemoteControlsPage("track-remotes", 8, null);
        trackRemotes.setHardwareLayout(HardwareControlType.SLIDER, 8);
        trackRemotes.pageNames().addValueObserver(names -> {
            trackRemotePageNames = names;
            applyCurrentValues(Focus.TRACK);
        });
        trackRemotes.selectedPageIndex().addValueObserver(index -> {
            trackRemotePageIndex = index;
            applyCurrentValues(Focus.TRACK);
        });

        projectRemotes = rootTrack.createCursorRemoteControlsPage("project-remotes", 8, null);
        projectRemotes.setHardwareLayout(HardwareControlType.SLIDER, 8);
        projectRemotes.pageNames().addValueObserver(names -> {
            projectRemotePageNames = names;
            applyCurrentValues(Focus.PROJECT);
        });
        projectRemotes.selectedPageIndex().addValueObserver(index -> {
            projectRemotePageIndex = index;
            applyCurrentValues(Focus.PROJECT);
        });
        drumPadBank = primaryDevice.createDrumPadBank(16);
        for (int i = 0; i < 16; i++) {
            final int index = i;
            final DrumPad pad = drumPadBank.getItemAt(i);
            pad.name().addValueObserver(name -> handlePadNameChanged(index, name));
            pad.addIsSelectedInEditorObserver(selected -> handlePadSelection(selected, index, pad));
        }

        initRemotesPage(deviceRemotePages);
        initRemotesPage(trackRemotes);
        initRemotesPage(projectRemotes);
    }

    private void handlePadNameChanged(final int index, final String name) {
        if (index == selectedPadIndex.get()) {
            padRawName = name;
            if (cursorDevice.hasDrumPads().get()) {
                pageName.set(padRawName);
            }
        }
    }

    private void handlePadSelection(final boolean selected, final int index, final DrumPad pad) {
        if (selected) {
            selectedPadIndex.set(index);
            padRawName = pad.name().get();
            if (cursorDevice.hasDrumPads().get()) {
                pageName.set(padRawName);
            }
        }
    }

    public void setCurrentFocus(final Focus focus) {
        if (this.currentFocus != focus) {
            this.currentFocus = focus;
            applyCurrentValues(focus);
            if (this.focusListener != null) {
                this.focusListener.accept(this.currentFocus);
            }
        }
    }

    public PinnableCursorDevice getPrimaryDevice() {
        return primaryDevice;
    }

    public PinnableCursorDevice getCursorDevice() {
        return cursorDevice;
    }

    public void setFocusListener(final Consumer<Focus> focusListener) {
        this.focusListener = focusListener;
    }

    private void applyCurrentValues(final Focus focus) {
        if (focus != this.currentFocus) {
            return;
        }
        if (this.currentFocus == Focus.DEVICE) {
            deviceName.set(deviceRawName);
            if (devicePageIndex >= 0 && devicePageIndex < devicePageNames.length) {
                pageName.set(devicePageNames[devicePageIndex]);
            } else {
                pageName.set("<No Remotes>");
            }
        } else if (this.currentFocus == Focus.TRACK) {
            deviceName.set("Track Remotes");
            if (trackRemotePageIndex >= 0 && trackRemotePageIndex < trackRemotePageNames.length) {
                pageName.set(trackRemotePageNames[trackRemotePageIndex]);
            } else {
                pageName.set("<No Remotes>");
            }
        } else if (this.currentFocus == Focus.PROJECT) {
            deviceName.set("Project Remotes");
            if (projectRemotePageIndex >= 0 && projectRemotePageIndex < projectRemotePageNames.length) {
                pageName.set(projectRemotePageNames[projectRemotePageIndex]);
            } else {
                pageName.set("<No Remotes>");
            }
        }
        if (cursorDevice.hasDrumPads().get()) {
            pageName.set(padRawName);
        }
    }

    public BasicStringValue getDeviceName() {
        return deviceName;
    }

    public BasicStringValue getPageName() {
        return pageName;
    }

    public void selectDevice(final int dir) {
        switch (currentFocus) {
            case DEVICE -> navigateDevice(dir);
            case TRACK -> navigateTrack(dir);
            case PROJECT -> navigateProject(dir);
        }
    }

    private void navigateTrack(final int dir) {
        if (dir > 0) {
            setCurrentFocus(Focus.DEVICE);
        } else {
            setCurrentFocus(Focus.PROJECT);
        }
    }

    private void navigateProject(final int dir) {
        if (dir > 0) {
            setCurrentFocus(Focus.TRACK);
        }
    }

    public void navigateDevice(final int dir) {
        if (dir > 0) {
            cursorDevice.selectNext();
        } else if (cursorDevice.hasPrevious().get()) {
            cursorDevice.selectPrevious();
        } else {
            setCurrentFocus(Focus.TRACK);
        }
    }

    public boolean canScrollDevices(final int dir) {
        return switch (currentFocus) {
            case DEVICE -> dir <= 0 || cursorDevice.hasNext().get();
            case TRACK -> true;
            case PROJECT -> dir > 0;
        };
    }

    public void selectParameterPage(final int dir) {
        if (dir > 0) {
            getCurrentPage().selectNext();
        } else {
            getCurrentPage().selectPrevious();
        }
    }

    public CursorRemoteControlsPage getCurrentPage() {
        return getPage(currentFocus);
    }

    public CursorRemoteControlsPage getPage(final Focus focus) {
        return switch (focus) {
            case TRACK -> trackRemotes;
            case DEVICE -> deviceRemotePages;
            case PROJECT -> projectRemotes;
        };
    }

    public DrumPadBank getDrumPadBank() {
        return drumPadBank;
    }

    public boolean canScrollParameterPages(final int dir) {
        if (dir > 0) {
            return getCurrentPage().hasNext().get();
        }
        return getCurrentPage().hasPrevious().get();
    }

    public boolean canNavigateIntoDevice(final int dir) {
        if (dir > 0) {
            return cursorDevice.hasLayers().get() || cursorDevice.hasDrumPads().get() || cursorDevice.hasSlots().get();
        }
        return true;
    }

    public void navigateVertical(final int dir) {
        if (dir > 0) {
            if (cursorDevice.hasDrumPads().get()) {
                cursorDevice.selectFirstInKeyPad(36); // to do get from pad
            } else if (cursorDevice.hasLayers().get()) {
                cursorDevice.selectFirstInLayer(0);
            } else if (cursorDevice.hasSlots().get()) {
                final String[] slotNames = cursorDevice.slotNames().get();
                cursorDevice.selectFirstInSlot(slotNames[0]);
            }
        } else {
            cursorDevice.selectParent();
        }
    }

    private void initRemotesPage(final CursorRemoteControlsPage remotesPage) {
        remotesPage.hasPrevious().markInterested();
        remotesPage.hasNext().markInterested();
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/FocusClip.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.di.Inject;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;

@Component
public class FocusClip {
    private static final int SINGLE_SLOT_RANGE = 8;

    private final CursorTrack cursorTrack;
    private final Application application;
    private final Transport transport;
    private final Clip mainCursorClip;
    private final Project project;
    private final ControllerHost host;
    private final OverviewGrid overviewGrid;

    private int selectedSlotIndex = -1;
    private int scrollOffset = 0;

    private String currentTrackName = "";

    private final Map<String, Integer> indexMemory = new HashMap<>();
    private final ClipLauncherSlotBank slotBank;
    private ClipLauncherSlot focusSlot;
    private Runnable scrollTask = null;

    @Inject
    private MidiProcessor midiProcessor;

    public FocusClip(ControllerHost host, Application application, Transport transport, ViewControl viewControl,
                     Project project) {
        this.cursorTrack = viewControl.getCursorTrack();
        this.project = project;
        this.host = host;
        this.overviewGrid = viewControl.getOverviewGrid();
        slotBank = cursorTrack.clipLauncherSlotBank();
        for (int i = 0; i < slotBank.getSizeOfBank(); i++) {
            final ClipLauncherSlot slot = slotBank.getItemAt(i);
            slot.exists().markInterested();
            slot.isRecording().markInterested();
            slot.isPlaying().markInterested();
            slot.hasContent().markInterested();
        }

        this.application = application;
        this.transport = transport;

        slotBank.addPlaybackStateObserver((slotIndex, playbackState, isQueued) -> {
            if (playbackState != 0 && !isQueued) {
                slotBank.select(slotIndex);
            }
        });
        slotBank.addIsSelectedObserver((index, selected) -> {
            if (selected) {
                selectedSlotIndex = index;
                indexMemory.put(currentTrackName, selectedSlotIndex);
                focusSlot = slotBank.getItemAt(selectedSlotIndex);
            }
        });
        slotBank.scrollPosition().addValueObserver(scrollPos -> {
            //Apc64Extension.println(" SB %d %d", scrollPos, overviewGrid.getNumberOfScenes());
            scrollOffset = scrollPos;
            if (scrollTask != null) {
                scrollTask.run();
                scrollTask = null;
            }
        });

        this.cursorTrack.name().addValueObserver(name -> {
            selectedSlotIndex = -1;
            currentTrackName = name;
            final Integer index = indexMemory.get(name);
            if (index != null) {
                selectedSlotIndex = index.intValue();
            }
        });
        mainCursorClip = viewControl.getCursorClip();
    }

    public void invokeRecord() {
        if (selectedSlotIndex != -1) {
            final ClipLauncherSlot slot = slotBank.getItemAt(selectedSlotIndex);
            if (slot.isRecording().get()) {
                slot.launch();
                transport.isClipLauncherOverdubEnabled().set(false);
            } else {
                Optional<ClipLauncherSlot> emptySlot = getFirstEmptySlot(selectedSlotIndex);
                if (emptySlot.isPresent()) {
                    recordAction(emptySlot.get());
                } else {
                    project.createScene();
                    host.scheduleTask(
                            () -> getFirstEmptySlot(selectedSlotIndex).ifPresent(newSlot -> recordAction(newSlot)), 50);
                }
            }
        } else {
            getFirstEmptySlot(selectedSlotIndex).ifPresent(slot -> recordAction(slot));
        }
    }

    private void recordAction(ClipLauncherSlot emptySlot) {
        emptySlot.launch();
        transport.isClipLauncherOverdubEnabled().set(true);
    }

    public void duplicateContent() {
        mainCursorClip.duplicateContent();
    }

    public void quantize(final double amount) {
        mainCursorClip.quantize(amount);
    }

    public void clearSteps() {
        mainCursorClip.clearSteps();
    }

    public void transpose(final int semitones) {
        mainCursorClip.transpose(semitones);
    }

    public void focusOnNextEmpty(Consumer<ClipLauncherSlot> postCreation) {
        if (focusSlotIsEmpty()) {
            postCreation.accept(focusSlot);
        } else {
            getFirstEmptySlot(selectedSlotIndex) //
                    .ifPresentOrElse(slot -> postCreation.accept(slot),  //
                            () -> ensureEmptySlot(postCreation));
        }
    }

    private void ensureEmptySlot(Consumer<ClipLauncherSlot> postCreation) {
        project.createScene();
        host.scheduleTask(() -> getFirstEmptySlot(selectedSlotIndex).ifPresent(newSlot -> postCreation.accept(newSlot)),
                50);
    }

    private boolean focusSlotIsEmpty() {
        return focusSlot != null && !focusSlot.hasContent().get() && focusSlot.exists().get();
    }

    private Optional<ClipLauncherSlot> getFirstEmptySlot(int startIndex) {
        int start = startIndex < 0 ? 0 : startIndex;
        for (int i = start; i < slotBank.getSizeOfBank(); i++) {
            final ClipLauncherSlot slot = slotBank.getItemAt(i);
            if (!slot.hasContent().get() && slot.exists().get()) {
                return Optional.of(slot);
            }
        }
        return Optional.empty();
    }

    public void clearNotes(int noteToClear) {
        mainCursorClip.clearStepsAtY(0, noteToClear);
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/HardwareElements.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.MidiIn;
import com.bitwig.extensions.controllers.akai.apc.common.control.ClickEncoder;
import com.bitwig.extensions.controllers.akai.apc.common.control.RgbButton;
import com.bitwig.extensions.controllers.akai.apc64.control.OledBacklight;
import com.bitwig.extensions.controllers.akai.apc64.control.SingleLedButton;
import com.bitwig.extensions.controllers.akai.apc64.control.TouchSlider;
import com.bitwig.extensions.framework.di.Component;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class HardwareElements {
    private RgbButton[][] buttons;
    private RgbButton[][] drumButtons;
    private SingleLedButton[] sceneButtons;
    private TouchSlider[] sliders = new TouchSlider[8];
    private final RgbButton[] trackButtons = new RgbButton[8];
    private final RgbButton[] trackControlButtons = new RgbButton[8];
    private final ClickEncoder mainEncoder;
    private final SingleLedButton encoderPress;
    private final Map<Apc64CcAssignments, SingleLedButton> mainButtons;
    private final OledBacklight oledBackLight;

    public HardwareElements(ControllerHost host, HardwareSurface surface, Apc64MidiProcessor midiProcessor) {
        MidiIn midiIn = midiProcessor.getMidiIn();
        final int numberOfScenes = 8;
        drumButtons = new RgbButton[numberOfScenes][8];
        int noteNr = Apc64CcAssignments.GRID_BASE.getStateId();
        buttons = new RgbButton[numberOfScenes][8];
        sceneButtons = new SingleLedButton[numberOfScenes];
        for (int row = 0; row < numberOfScenes; row++) {
            for (int col = 0; col < 8; col++) {
                buttons[row][col] = new RgbButton(6, noteNr++, "PAD", surface, midiProcessor);
            }
            sceneButtons[row] = new SingleLedButton(Apc64CcAssignments.SCENE_BUTTON_BASE.getStateId() + row, "SCENE",
                    surface, midiProcessor);
        }
        mainEncoder = new ClickEncoder(0x5A, host, surface, midiIn);
        encoderPress = new SingleLedButton(0x5A, "ENCODER_PRESS", surface, midiProcessor);
        oledBackLight = new OledBacklight(surface, midiProcessor, 0x59);

        mainButtons = Arrays.stream(Apc64CcAssignments.values()) //
                .filter(Apc64CcAssignments::isSingle) //
                .collect(Collectors.toMap(assignment -> assignment,//
                        assignment -> new SingleLedButton(assignment.getStateId(), assignment.toString(), surface,
                                midiProcessor)));

        for (int i = 0; i < 8; i++) {
            sliders[i] = new TouchSlider(i, surface, midiProcessor);
            trackButtons[i] = new RgbButton(0, Apc64CcAssignments.TRACKS_BASE.getStateId() + i, "TRACK_SEL", surface,
                    midiProcessor);
            trackControlButtons[i] = new RgbButton(0, Apc64CcAssignments.TRACK_CONTROL_BASE.getStateId() + i,
                    "TRACK_CTL", surface, midiProcessor);
        }
    }

    public void invokeRefresh() {
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                buttons[i][j].refresh();
            }
        }
    }

    public SingleLedButton getSceneButton(int index) {
        return sceneButtons[index];
    }

    public OledBacklight getOledBackLight() {
        return oledBackLight;
    }

    public SingleLedButton getButton(Apc64CcAssignments assignment) {
        return mainButtons.get(assignment);
    }

    public ClickEncoder getMainEncoder() {
        return mainEncoder;
    }

    public SingleLedButton getEncoderPress() {
        return encoderPress;
    }

    public RgbButton getTrackSelectButton(int index) {
        return trackButtons[index];
    }

    public RgbButton getTrackControlButtons(int index) {
        return trackControlButtons[index];
    }

    public RgbButton getGridButton(final int sceneIndex, final int trackIndex) {
        return buttons[buttons.length - sceneIndex - 1][trackIndex];
    }

    public RgbButton getDrumButton(final int sceneIndex, final int trackIndex) {
        return drumButtons[buttons.length - sceneIndex - 1][trackIndex];
    }

    public TouchSlider[] getTouchSliders() {
        return sliders;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/Menu.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extension.controller.api.SettableEnumValue;
import com.bitwig.extensions.controllers.akai.apc64.layer.MainDisplay;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class Menu {
    private final MainDisplay.Screen screen;
    private final List<MenuItem> items = new ArrayList<>();
    private int itemIndex = 0;
    private boolean onMenu = true;
    private MenuItem currentMenu;

    public record EnumMenuValue(String value, String displayValue) {

    }

    public abstract static class MenuItem {
        private final String name;
        protected Consumer<String> updater;

        protected MenuItem(final String name) {
            this.name = name;
        }

        public void setFocusScreen(final Consumer<String> updater) {
            this.updater = updater;
        }

        public void release() {
            this.updater = null;
        }

        public void update(final String newValue) {
            if (updater != null) {
                updater.accept(newValue);
            }
        }

        public abstract String getCurrentValue();

        public abstract void handleIncrement(final int dir);

        public boolean isMomentary() {
            return false;
        }

        public void handlePressed(final boolean pressed) {
        }
    }

    public static class EnumMenuItem extends MenuItem {
        private final SettableEnumValue value;
        private final List<EnumMenuValue> selection;
        private EnumMenuValue current;

        public EnumMenuItem(final String name, final SettableEnumValue value, final List<EnumMenuValue> selection) {
            super(name);
            value.markInterested();
            this.value = value;
            this.selection = selection;
            this.current = selection.get(0);
            value.addValueObserver(enumValue -> this.update(enumValue));
        }

        public void update(final String newValue) {
            current = selection.stream().filter(v -> v.value.equals(newValue)).findFirst().orElse(null);
            if (updater != null) {
                updater.accept(current.displayValue());
            }
        }

        @Override
        public String getCurrentValue() {
            return current.displayValue();
        }

        public void handleIncrement(final int dir) {
            current = nextValue(value.get(), selection, dir, false);
            value.set(current.value());
        }

    }

    public static class BooleanToggleMenuItem extends MenuItem {
        private final SettableBooleanValue value;

        public BooleanToggleMenuItem(final String name, final SettableBooleanValue value) {
            super(name);
            this.value = value;
            value.addValueObserver(boolValue -> this.update(boolValue ? "On" : "Off"));
        }

        public void handlePressed(final boolean pressed) {
            if (pressed) {
                value.toggle();
            }
        }

        @Override
        public boolean isMomentary() {
            return true;
        }

        @Override
        public String getCurrentValue() {
            return value.get() ? "On" : "Off";
        }

        public void handleIncrement(final int dir) {
            value.toggle();
        }

    }

    public static class HoldMenuItem extends MenuItem {
        private final SettableBooleanValue value;

        public HoldMenuItem(final String name, final SettableBooleanValue value) {
            super(name);
            this.value = value;
            value.addValueObserver(boolValue -> this.update(boolValue ? "On" : "Off"));
        }

        @Override
        public String getCurrentValue() {
            return value.get() ? "On" : "Off";
        }

        @Override
        public void handleIncrement(final int dir) {
        }

        @Override
        public void handlePressed(final boolean pressed) {
            value.set(pressed);
        }

        public boolean isMomentary() {
            return true;
        }
    }

    public Menu(final MainDisplay.Screen screen) {
        this.screen = screen;
        screen.setRow(0, "Bitwig Menu");
    }

    public void addMenuItem(final MenuItem item) {
        this.items.add(item);
    }

    public void init() {
        if (this.items.isEmpty()) {
            return;
        }
        currentMenu = this.items.get(0);
        currentMenu.setFocusScreen(this::updateValue);
        update();
    }

    private void update() {
        final MenuItem menuItem = items.get(itemIndex);
        screen.setRow(1, "%s %s ".formatted(onMenu ? ">" : " ", menuItem.name));
        updateValue(menuItem.getCurrentValue());
    }

    public void handleInc(final int dir) {
        if (onMenu) {
            final int nextIndex = itemIndex + dir;
            if (nextIndex >= 0 && nextIndex < items.size()) {
                items.get(itemIndex).release();
                itemIndex = nextIndex;
                items.get(itemIndex).setFocusScreen(this::updateValue);
                currentMenu = this.items.get(itemIndex);
                update();
            }
        } else {
            final MenuItem menuItem = items.get(itemIndex);
            menuItem.handleIncrement(dir);
            update();
        }
    }

    private void updateValue(final String value) {
        screen.setRow(2, "%s%s ".formatted(!onMenu ? ">" : "", value));
    }

    public void handEncoderClick(final boolean pressed) {
        Apc64Extension.println(" ON menu %s %s", currentMenu.getClass().getName(), onMenu);
        if (currentMenu.isMomentary()) {
            onMenu = true;
            currentMenu.handlePressed(pressed);
            update();
        } else {
            if (pressed) {
                onMenu = !onMenu;
                update();
            }
        }
    }

    public static EnumMenuValue nextValue(final String currentValue, final List<EnumMenuValue> list, final int inc,
                                          final boolean wrap) {
        int index = -1;
        final int size = list.size();
        for (int i = 0; i < size; i++) {
            if (currentValue.equals(list.get(i).value())) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            final int next = index + inc;
            if (next >= 0 && next < size) {
                return list.get(next);
            } else if (wrap) {
                index = next < 0 ? size - 1 : next >= size ? 0 : next;
            }
            return list.get(index);
        }
        return list.get(0);
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/ModifierStates.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.values.BooleanValueObject;

@Component
public class ModifierStates {

    public static final int MSK_SHIFT = 0x1;
    public static final int MSK_CLEAR = 0x2;

    private final BooleanValueObject shiftActive = new BooleanValueObject();
    private final BooleanValueObject clearActive = new BooleanValueObject();
    private final BooleanValueObject duplicateActive = new BooleanValueObject();
    private final SettableBooleanValue quantizeActive = new BooleanValueObject();
    private final BooleanValueObject altActive = new BooleanValueObject();

    private int modifierMask = 0;

    public ModifierStates(final ControllerHost host) {
        shiftActive.addValueObserver(active -> setMask(MSK_SHIFT, active));
        clearActive.addValueObserver(active -> setMask(MSK_CLEAR, active));
    }

    private void setMask(final int mask, final boolean value) {
        if (value) {
            modifierMask |= mask;
        } else {
            modifierMask &= ~mask;
        }
    }

    public void setShift(final boolean active) {
        shiftActive.set(active);
    }

    public void setClear(final boolean active) {
        clearActive.set(active);
    }

    public BooleanValueObject getShiftActive() {
        return shiftActive;
    }

    public BooleanValueObject getClearActive() {
        return clearActive;
    }

    public boolean isShift() {
        return shiftActive.get();
    }

    public boolean isClear() {
        return clearActive.get();
    }

    public boolean anyModifierHeld() {
        return modifierMask > 0;
    }

    public boolean noModifier() {
        return modifierMask == 0;
    }

    public boolean onlyShift() {
        return modifierMask == MSK_SHIFT;
    }

    public void setDuplicate(final boolean active) {
        duplicateActive.set(active);
    }

    public boolean isDuplicate() {
        return duplicateActive.get();
    }

    public SettableBooleanValue getQuantizeActive() {
        return quantizeActive;
    }

    public BooleanValueObject getAltActive() {
        return altActive;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/OverviewGrid.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

public class OverviewGrid {

    private int sceneOffset;
    private int trackOffset;
    private int numberOfScenes;
    private int numberOfTracks;

    private int trackPosition;
    private int scenePosition;

    private final int[][] hasClips = new int[8][8];
    private final int[] sceneQueuedClips = new int[64];

    public int getNumberOfScenes() {
        return numberOfScenes;
    }

    public void setNumberOfScenes(final int numberOfScenes) {
        this.numberOfScenes = numberOfScenes;
    }

    public int getNumberOfTracks() {
        return numberOfTracks;
    }

    public void setNumberOfTracks(final int numberOfTracks) {
        this.numberOfTracks = numberOfTracks;
    }

    public int getTrackPosition() {
        return trackPosition - trackOffset;
    }

    public int getTrackOffset() {
        return trackOffset;
    }

    public void setTrackPosition(final int trackPosition) {
        this.trackPosition = trackPosition;
        this.trackOffset = (trackPosition / 64) * 64;
    }

    public int getScenePosition() {
        return scenePosition - sceneOffset;
    }

    public void setScenePosition(final int scenePosition) {
        this.scenePosition = scenePosition;
        this.sceneOffset = (scenePosition / 64) * 64;
    }

    public int getSceneOffset() {
        return sceneOffset;
    }

    public void markSceneQueued(int sceneIndex, boolean isQueued) {
        if (isQueued) {
            sceneQueuedClips[sceneIndex]++;
        } else if (sceneQueuedClips[sceneIndex] > 0) {
            sceneQueuedClips[sceneIndex]--;
        }
    }

    public void setHasClips(int trackIndex, int sceneIndex, boolean hasClip) {
        int gridScene = (sceneIndex) / 8;
        int gridTrack = (trackIndex) / 8;
        if (hasClip) {
            this.hasClips[gridTrack][gridScene]++;
        } else if (this.hasClips[gridTrack][gridScene] > 0) {
            this.hasClips[gridTrack][gridScene]--;
        }
    }

    public boolean hasClips(int trackIndex, int sceneIndex) {
        return this.hasClips[trackIndex][sceneIndex] > 0;
    }

    public boolean hasQueuedScenes(int sceneIndex) {
        int index = sceneIndex - sceneOffset;
        if (index > 63) {
            return false;
        }
        return this.sceneQueuedClips[sceneIndex - sceneOffset] > 0;
    }

    public boolean inGrid(int trackIndex, int sceneIndex) {
        final int posX = trackIndex * 8;
        final int posY = sceneIndex * 8;
        return posX < (numberOfTracks - trackOffset) && posY < (numberOfScenes - sceneOffset);
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/PadMode.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import java.util.Arrays;

public enum PadMode {
    SESSION(0, true, false),
    OVERVIEW(1, true, false),
    NOTE(2, false, true),
    CHORD(3),
    CHORD_SETTINGS(4),
    DRUM(5, true, true),
    STEP_SEQUENCER(6),
    STEP_SEQUENCER_SETTINGS(7),
    PROJECT(8),
    CUSTOM(9),
    CUSTOM_SETTINGS(10),
    UNKNOWN(-1);

    private final int modeId;
    private final boolean hasLocalControl;
    private final boolean isKeyRelated;

    PadMode(int modeId, boolean hasLocalControl, boolean isKeyRelated) {
        this.modeId = modeId;
        this.hasLocalControl = hasLocalControl;
        this.isKeyRelated = isKeyRelated;
    }

    PadMode(int modeId) {
        this(modeId, false, false);
    }

    public int getModeId() {
        return modeId;
    }

    public static PadMode fromId(int id) {
        return Arrays.stream(PadMode.values()).filter(mode -> mode.getModeId() == id).findFirst().orElse(UNKNOWN);
    }

    public boolean hasLocalControl() {
        return hasLocalControl;
    }

    public boolean isKeyRelated() {
        return isKeyRelated;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/PrintToClipSeq.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.Clip;

import java.util.ArrayList;
import java.util.List;

public class PrintToClipSeq {
    public static final double PPQ_RESOLUTION = 96.0;
    private static int[] STEP_DIVISOR = {96, 64, 48, 32, 24, 16, 12, 8};
    private static final double[] RESOLUTIONS = {1.0, 0.666666, 0.5, 0.33333, 0.25, 0.1666666, 0.125, 0.0833333};

    private List<StepNote> notes = new ArrayList<>();
    private int length;
    private int headValue;

    public record StepNote(int start, int end, int note, int vel, int block, int tail) {
        public StepNote(String sysEx) {
            this(fromHexValueMask(sysEx, 1), fromHexValueMask(sysEx, 5), fromHexValue(sysEx, 3), fromHexValue(sysEx, 4),
                    fromHexValue(sysEx, 0), fromHexValue(sysEx, 7));
        }
    }

    public PrintToClipSeq(int length) {
        this.length = length;
    }

    public void setNotes(List<StepNote> notes) {
        this.notes = notes;
    }

    public void setHeadValue(int headValue) {
        this.headValue = headValue;
    }

    public int getLength() {
        return length;
    }

    public int getHeadValue() {
        return headValue;
    }

    public double getClipLen() {
        return (double) length / PPQ_RESOLUTION;
    }

    private static int fromHexValue(String overall, int offset) {
        return Integer.parseInt(overall.substring(offset * 2, offset * 2 + 2), 16);
    }

    public boolean hasNotes() {
        return !notes.isEmpty();
    }

    private static int fromHexValueMask(String overall, int offset) {
        String hex = overall.substring(offset * 2, offset * 2 + 4);
        int v1 = Integer.parseInt(hex.substring(0, 2), 16);
        int v2 = Integer.parseInt(hex.substring(2, 4), 16);
        return ((v1 & 0x3F) << 7) | v2;
    }

    public void addNoteData(String data) {
        int nrOfNotes = data.length() / 16;
        for (int i = 0; i < nrOfNotes; i++) {
            int offset = i * 16;
            String noteData = data.substring(offset, offset + 16);
            notes.add(new StepNote(noteData));
        }
    }

    public int getFittingIndex(int position) {
        for (int i = 0; i < STEP_DIVISOR.length; i++) {
            if (position % STEP_DIVISOR[i] == 0) {
                return i;
            }
        }
        return -1;
    }

    private int calculateResolutionIndex() {
        int res = 0;
        for (StepNote note : notes) {
            res = Math.max(res, getFittingIndex(note.start));
        }
        return res;
    }

    public void applyToClip(final Clip clip, int count) {
        double clipLen = getClipLen();
        clip.getPlayStop().set(clipLen);
        clip.getLoopLength().set(clipLen);
        clip.setName(String.format("SEQ APC %d".formatted(count)));
        final int resIndex = calculateResolutionIndex();
        clip.setStepSize(RESOLUTIONS[resIndex]);
        for (StepNote note : notes) {
            int x = note.start / STEP_DIVISOR[resIndex];
            int y = note.note;
            double len = (note.end - note.start) / PPQ_RESOLUTION;
            clip.setStep(x, y, note.vel, len);
        }
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/StringUtil.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

public class StringUtil {
    private static final char[] SPECIALS = {'ä', 'ü', 'ö', 'Ä', 'Ü', 'Ö', 'ß', 'é', 'è', 'ê', 'â', 'á', 'à', //
            'û', 'ú', 'ù', 'ô', 'ó', 'ò'};
    private static final String[] REPLACE = {"a", "u", "o", "A", "U", "O", "ss", "e", "e", "e", "a", "a", "a", //
            "u", "u", "u", "o", "o", "o"};

    public static String nextValue(final String currentValue, final String[] list, final int inc, final boolean wrap) {
        int index = -1;
        for (int i = 0; i < list.length; i++) {
            if (currentValue.equals(list[i])) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            final int next = index + inc;
            if (next >= 0 && next < list.length) {
                return list[next];
            } else if (wrap) {
                index = next < 0 ? list.length - 1 : next >= list.length ? 0 : next;
            }
            return list[index];
        }
        return list[0];
    }

    public static String toAsciiDisplay(final String name, final int maxLen) {
        final StringBuilder b = new StringBuilder();
        for (int i = 0; i < name.length() && b.length() < maxLen; i++) {
            final char c = name.charAt(i);
//            if (c == 32) {
//                continue;
//            }
            if (c < 128) {
                b.append(c);
            } else {
                final int replacement = getReplace(c);
                if (replacement >= 0) {
                    b.append(REPLACE[replacement]);
                }
            }
        }
        return b.toString();
    }

    private static int getReplace(final char c) {
        for (int i = 0; i < SPECIALS.length; i++) {
            if (c == SPECIALS[i]) {
                return i;
            }
        }
        return -1;
    }


}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/ViewControl.java
================================================
package com.bitwig.extensions.controllers.akai.apc64;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.led.ColorLookup;
import com.bitwig.extensions.framework.di.Component;

@Component
public class ViewControl {

    private final TrackBank trackBank;
    private final TrackBank maxTrackBank;
    private final CursorTrack cursorTrack;
    private final Track rootTrack;
    private final Clip cursorClip;
    private final DeviceControl deviceControl;
    private int selectedTrackIndex;
    private final int[] trackColors = new int[8];
    private int cursorTrackColor = 0;
    private final OverviewGrid overviewGrid = new OverviewGrid();

    public ViewControl(final ControllerHost host) {
        rootTrack = host.getProject().getRootTrackGroup();
        trackBank = host.createTrackBank(8, 1, 8, true);
        maxTrackBank = host.createTrackBank(64, 1, 64, false);
        maxTrackBank.sceneBank().scrollPosition().markInterested();
        maxTrackBank.scrollPosition().markInterested();

        trackBank.sceneBank().itemCount().addValueObserver(overviewGrid::setNumberOfScenes);
        trackBank.channelCount().addValueObserver(overviewGrid::setNumberOfTracks);
        trackBank.scrollPosition().addValueObserver(pos -> {
            overviewGrid.setTrackPosition(pos);
            if (maxTrackBank.scrollPosition().get() != overviewGrid.getTrackOffset()) {
                maxTrackBank.scrollPosition().set(overviewGrid.getTrackOffset());
            }
        });
        trackBank.sceneBank().scrollPosition().addValueObserver(pos -> {
            overviewGrid.setScenePosition(pos);
            if (maxTrackBank.sceneBank().scrollPosition().get() != overviewGrid.getSceneOffset()) {
                maxTrackBank.sceneBank().scrollPosition().set(overviewGrid.getSceneOffset());
            }
        });

        cursorTrack = host.createCursorTrack(6, 128);
        trackBank.followCursorTrack(cursorTrack);
        cursorTrack.exists().markInterested();
        for (int i = 0; i < 8; i++) {
            int index = i;
            Track track = trackBank.getItemAt(i);
            prepareTrack(track);
            track.color().addValueObserver((r, g, b) -> {
                trackColors[index] = ColorLookup.toColor(r, g, b);
            });
            track.addIsSelectedInMixerObserver(select -> {
                if (select) {
                    this.selectedTrackIndex = index;
                }
            });
        }
        setUpFocusScene();

        deviceControl = new DeviceControl(cursorTrack, rootTrack);
        cursorTrack.name().markInterested();
        cursorClip = host.createLauncherCursorClip(32, 128);
        cursorClip.setStepSize(0.125);

        cursorTrack.color().addValueObserver((r, g, b) -> {
            this.cursorTrackColor = com.bitwig.extensions.controllers.novation.commonsmk3.ColorLookup.toColor(r, g, b);
        });
        prepareTrack(cursorTrack);
    }

    private void setUpFocusScene() {
        for (int i = 0; i < 64; i++) {
            final int trackIndex = i;
            Track track = maxTrackBank.getItemAt(trackIndex);
            for (int j = 0; j < 64; j++) {
                int sceneIndex = j;
                final ClipLauncherSlot slot = track.clipLauncherSlotBank().getItemAt(sceneIndex);
                slot.hasContent().addValueObserver(hasContent -> {
                    overviewGrid.setHasClips(trackIndex, sceneIndex, hasContent);
                });
                slot.isPlaybackQueued().addValueObserver(isQueued -> {
                    overviewGrid.markSceneQueued(sceneIndex, isQueued);
                });
            }
        }
    }

    public int getTrackColor(int index) {
        return trackColors[index];
    }

    public int getCursorTrackColor() {
        return cursorTrackColor;
    }

    public int getSelectedTrackIndex() {
        return selectedTrackIndex;
    }

    private void prepareTrack(final Track track) {
        track.arm().markInterested();
        track.exists().markInterested();
        track.solo().markInterested();
        track.mute().markInterested();
    }

    public void scrollToOverview(final int trackIndex, final int sceneIndex) {
        final int posX = trackIndex * 8 + overviewGrid.getTrackOffset();
        final int posY = sceneIndex * 8 + overviewGrid.getSceneOffset();
        if (posX < overviewGrid.getNumberOfTracks() && posY < overviewGrid.getNumberOfScenes()) {
            trackBank.scrollPosition().set(posX);
            trackBank.sceneBank().scrollPosition().set(posY);
        }
    }

    public boolean inOverviewGrid(final int trackIndex, final int sceneIndex) {
        return overviewGrid.inGrid(trackIndex, sceneIndex);
    }

    public boolean canScrollVertical(final int delta) {
        int newPos = overviewGrid.getScenePosition() + delta;
        return newPos >= 0 && newPos < overviewGrid.getNumberOfScenes();
    }


    public boolean canScrollHorizontal(final int delta) {
        int newPos = overviewGrid.getTrackPosition() + delta;
        return newPos >= 0 && newPos < overviewGrid.getNumberOfTracks();
    }

    public boolean inOverviewGridFocus(final int trackIndex, final int sceneIndex) {
        final int locX = overviewGrid.getTrackPosition() / 8;
        final int locY = overviewGrid.getScenePosition() / 8;
        return locX == trackIndex && locY == sceneIndex;
    }


    public TrackBank getTrackBank() {
        return trackBank;
    }

    public CursorTrack getCursorTrack() {
        return cursorTrack;
    }

    public Track getRootTrack() {
        return rootTrack;
    }

    public Clip getCursorClip() {
        return cursorClip;
    }

    public OverviewGrid getOverviewGrid() {
        return overviewGrid;
    }

    public DeviceControl getDeviceControl() {
        return deviceControl;
    }

    public boolean hasQueuedClips(int sceneIndex) {
        return overviewGrid.hasQueuedScenes(sceneIndex);
    }

    public boolean hasClips(int trackIndex, int sceneIndex) {
        return overviewGrid.hasClips(trackIndex, sceneIndex);
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/FaderBinding.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.controller.api.Parameter;
import com.bitwig.extensions.framework.Binding;

public class FaderBinding extends Binding<Parameter, FaderResponse> {

   private double lastValue = 0.0;

   public FaderBinding(final Parameter source, final FaderResponse target) {
      super(target, source, target);
      source.value().addValueObserver(this::valueChange);
   }

   private void valueChange(final double value) {
      lastValue = value;
      if (isActive()) {
         getTarget().sendValue(value);
      }
   }

   @Override
   protected void deactivate() {
   }

   @Override
   protected void activate() {
      getTarget().sendValue(lastValue);
   }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/FaderLightState.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.controller.api.HardwareLightVisualState;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.SingleLedState;

public class FaderLightState extends InternalHardwareLightState {
    
    public static final FaderLightState OFF = new FaderLightState(0);
    public static final FaderLightState V_WHITE = new FaderLightState(1);
    public static final FaderLightState V_RED = new FaderLightState(2);
    public static final FaderLightState BIPOLOAR_WHITE = new FaderLightState(3);
    public static final FaderLightState BIPOLOAR_RED = new FaderLightState(4);
    
    private int code;
    
    private FaderLightState(int code) {
        this.code = code;
    }
    
    @Override
    public HardwareLightVisualState getVisualState() {
        return null;
    }
    
    @Override
    public boolean equals(final Object o) {
        if(o == this) {
            return true;
        }
        if(o instanceof FaderLightState state) {
            return state.code == code;
        }
        return false;
    }
    
    public int getCode() {
        return code;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/FaderResponse.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;

public class FaderResponse {
    private final MidiProcessor midiProcessor;
    private final int aftertouchValue;
    int lastValue = -1;

    public FaderResponse(final MidiProcessor midi, final int which) {
        aftertouchValue = 0xE0 | which;
        this.midiProcessor = midi;
    }

    public void sendValue(final double v) {
        final int value = (int) (v * 16383);
        if (value != lastValue) {
            lastValue = value;
            final int lsb = value & 0x7F;
            final int msb = value >> 7;
            midiProcessor.sendMidi(aftertouchValue, lsb, msb);
        }
    }

    public int getWhich() {
        return aftertouchValue & 0xF;
    }

    public void refresh() {
        final int lsb = lastValue & 0x7F;
        final int msb = lastValue >> 7;
        midiProcessor.sendMidi(aftertouchValue, lsb, msb);
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/OledBacklight.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extension.controller.api.MultiStateHardwareLight;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.framework.Layer;

import java.util.function.Supplier;

public class OledBacklight {

    private final MultiStateHardwareLight light;
    private final MidiProcessor midiProcessor;
    private final int midiId;

    public OledBacklight(HardwareSurface hwSurface, MidiProcessor midiProcessor, int midiId) {
        light = hwSurface.createMultiStateHardwareLight("OLED_COLOR_" + midiId);
        this.midiProcessor = midiProcessor;
        this.midiId = midiId;
        light.state().onUpdateHardware(this::updateState);
    }

    // Touch State Base 0x68
    // 0 - Off
    // 1 - V white
    // 2 - V red
    // 3 - P white
    // 4 - P red

    private void updateState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof RgbLightState) {
            RgbLightState state = (RgbLightState) internalHardwareLightState;
            //midiProcessor.sendMidi(0xB0, 0x68, 1);
            midiProcessor.sendMidi(0xB0, midiId, state.getColorIndex());
        }
    }

    public int getState() {
        return ((RgbLightState) light.state().currentValue()).getColorIndex();
    }

    public void bind(Layer layer, Supplier<InternalHardwareLightState> supplier) {
        layer.bindLightState(supplier, light);
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/SingleLedButton.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.HardwareSurface;
import com.bitwig.extension.controller.api.InternalHardwareLightState;
import com.bitwig.extensions.controllers.akai.apc.common.MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc.common.control.ApcButton;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.VarSingleLedState;
import com.bitwig.extensions.framework.values.Midi;

public class SingleLedButton extends ApcButton {

    public SingleLedButton(final int noteNr, final String name, final HardwareSurface surface,
                           final MidiProcessor midiProcessor) {
        super(0, noteNr, name, surface, midiProcessor);
        light.state().setValue(RgbLightState.OFF);
        light.state().onUpdateHardware(this::updateState);
        light.setColorToStateFunction(this::colorToState);
    }

    private InternalHardwareLightState colorToState(final Color color) {
        if (color.getRed255() == 0 && color.getBlue255() == 0 && color.getGreen255() == 0) {
            return VarSingleLedState.OFF;
        }
        return VarSingleLedState.FULL;
    }

    private void updateState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof VarSingleLedState state) {
            midiProcessor.sendMidi(Midi.NOTE_ON | state.getChannel(), midiId, state.getCode());
        } else {
            midiProcessor.sendMidi(Midi.NOTE_ON, midiId, 0);
        }
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/TouchSlider.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc64.Apc64MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc64.layer.MainDisplay;
import com.bitwig.extensions.framework.Layer;

import java.util.function.Consumer;
import java.util.function.Supplier;

public class TouchSlider {

    private final HardwareSlider fader;
    private final FaderResponse response;
    private final HardwareButton touchButton;
    private final MultiStateHardwareLight light;
    private final MultiStateHardwareLight lightState;

    private final int index;
    private final Apc64MidiProcessor midiProcessor;

    public TouchSlider(final int index, final HardwareSurface surface, final Apc64MidiProcessor midiProcessor) {
        fader = surface.createHardwareSlider("FADER_" + index);
        this.index = index;
        this.midiProcessor = midiProcessor;
        final MidiIn midiIn = midiProcessor.getMidiIn();
        fader.setAdjustValueMatcher(midiIn.createAbsolutePitchBendValueMatcher(index));

        response = new FaderResponse(midiProcessor, index);

        touchButton = surface.createHardwareButton("FADER_TOUCH_" + index);
        touchButton.pressedAction().setActionMatcher(midiIn.createNoteOnActionMatcher(0, 0x52 + index));
        touchButton.releasedAction().setActionMatcher(midiIn.createNoteOffActionMatcher(0, 0x52 + index));
        touchButton.isPressed().markInterested();
        fader.setHardwareButton(touchButton);
        light = surface.createMultiStateHardwareLight("FADER_COLOR_" + index);
        light.state().onUpdateHardware(this::updateLight);
        lightState = surface.createMultiStateHardwareLight("FADER_STATE_" + index);
        lightState.state().onUpdateHardware(this::updateState);
    }

    private void updateLight(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof RgbLightState state) {
            midiProcessor.sendMidi(0xB0, 0x70 + index, state.getColorIndex());
        }
    }

    private void updateState(final InternalHardwareLightState internalHardwareLightState) {
        if (internalHardwareLightState instanceof FaderLightState state) {
            midiProcessor.sendMidi(0xB0, 0x68 + index, state.getCode());
        }
    }

    public void bindParameter(final Layer layer, MainDisplay display, StringValue parameterOwner,
                              final Parameter parameter) {
        layer.addBinding(new FaderBinding(parameter, response));
        layer.addBinding(
                new TouchSliderControlBinding(index, this, parameter, parameterOwner, midiProcessor.getShiftMode(),
                        midiProcessor.getClearMode(), display));
    }

    public void bindIsPressed(final Layer layer, Consumer<Boolean> consumer) {
        layer.bind(touchButton, touchButton.pressedAction(), () -> consumer.accept(true));
        layer.bind(touchButton, touchButton.releasedAction(), () -> consumer.accept(false));
    }

    public void bindLightColor(final Layer layer, Supplier<InternalHardwareLightState> supplier) {
        layer.bindLightState(supplier, light);
    }

    public void bindLightState(final Layer layer, Supplier<InternalHardwareLightState> supplier) {
        layer.bindLightState(supplier, lightState);
    }

    public boolean isTouched() {
        return touchButton.isPressed().get();
    }

    public HardwareSlider getFader() {
        return fader;
    }

    public void sendValue(final int value) {
        response.sendValue(0);
    }


    public HardwareButton getTouchButton() {
        return touchButton;
    }

    public boolean isAutomated() {
        return false;
    }
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/control/TouchSliderControlBinding.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.control;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc64.layer.MainDisplay;
import com.bitwig.extensions.framework.Binding;
import com.bitwig.extensions.framework.values.BooleanValueObject;

public class TouchSliderControlBinding extends Binding<AbsoluteHardwareControl, Parameter> {

    private final MainDisplay display;
    private final StringValue parameterOwner;
    private final int sliderIndex;
    private AbsoluteHardwareControlBinding hardwareBinding;
    private final Parameter parameter;
    private double downParameterValue;
    private final TouchSlider slider;
    private boolean active = false;
    private double sliderDownValue;
    private boolean stripTouched;
    private boolean fineModeActive = false;
    private boolean stripJustTouched = false;
    private boolean clearActive = false;

    public TouchSliderControlBinding(int sliderIndex, final TouchSlider source, final Parameter target,
                                     StringValue parameterOwner, BooleanValueObject fineModifierActive,
                                     BooleanValue clearModifier, MainDisplay display) {
        super(source, source.getFader(), target);
        this.sliderIndex = sliderIndex;
        this.parameter = target;
        this.slider = source;
        this.display = display;
        this.parameterOwner = parameterOwner;
        this.parameterOwner.markInterested();
        parameter.name().markInterested();
        fineModifierActive.addValueObserver(this::enableFineMode);
        clearModifier.addValueObserver(this::handleClearActive);
        slider.getTouchButton().isPressed().addValueObserver(this::handleStripTouched);
        source.getFader().value().addValueObserver(this::handleSliderValue);
        target.displayedValue().addValueObserver(this::handleParamChanged);
    }

    private void handleClearActive(boolean clearActive) {
        this.clearActive = clearActive;
        if (!active) {
            return;
        }
        if (clearActive) {
            deactivateValueBinding();
        } else {
            activate();
        }
    }

    private void handleParamChanged(String value) {
        if (active && stripTouched) {
            display.setParameterValue(value);
        }
    }

    private void handleStripTouched(boolean touched) {
        if (!active) {
            return;
        }
        if (clearActive) {
            if (touched) {
                parameter.restoreAutomationControl();
            }
        } else if (touched) {
            stripJustTouched = true;
            this.downParameterValue = parameter.value().get();
            if (active) {
                display.touchParameter(parameterOwner.get(), parameter.name().get(), parameter.displayedValue().get());
            }
        } else if (active && this.stripTouched) {
            display.releaseTouchParameter(sliderIndex);
        }
        this.stripTouched = touched;
    }

    private void handleSliderValue(double value) {
        if (stripJustTouched) {
            this.sliderDownValue = value;
            stripJustTouched = false;
        }
        if (!active) {
            return;
        }
        if (fineModeActive && stripTouched) {
            handleDelta(value);
        }
    }

    private void enableFineMode(boolean fineActive) {
        fineModeActive = fineActive;
        if (!active) {
            return;
        }
        if (fineActive) {
            if (stripTouched) {
                downParameterValue = parameter.getAsDouble();
            }
            deactivateValueBinding();
        } else {
            activate();
        }
    }

    private void handleDelta(double value) {
        if (!active) {
            return;
        }
        double delta = (value - sliderDownValue) * 0.25;
        double newValue = Math.max(0, Math.min(1, downParameterValue + delta));
        parameter.setImmediately(newValue);
    }

    private void deactivateValueBinding() {
        if (hardwareBinding != null) {
            hardwareBinding.removeBinding();
            hardwareBinding = null;
        }
    }

    @Override
    protected void activate() {
        active = true;
        hardwareBinding = addHardwareBinding();
    }

    @Override
    protected void deactivate() {
        active = false;
        if (hardwareBinding == null) {
            return;
        }
        hardwareBinding.removeBinding();
        hardwareBinding = null;
    }

    protected AbsoluteHardwareControlBinding addHardwareBinding() {
        return getSource().addBindingWithRange(getTarget(), 0, 1);
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/layer/MainDisplay.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.layer;

import com.bitwig.extension.controller.api.Application;
import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.Groove;
import com.bitwig.extension.controller.api.SettableBeatTimeValue;
import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extension.controller.api.SettableEnumValue;
import com.bitwig.extension.controller.api.Transport;
import com.bitwig.extensions.controllers.akai.apc.common.OrientationFollowType;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.VarSingleLedState;
import com.bitwig.extensions.controllers.akai.apc64.Apc64CcAssignments;
import com.bitwig.extensions.controllers.akai.apc64.Apc64MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc64.ApcPreferences;
import com.bitwig.extensions.controllers.akai.apc64.DeviceControl;
import com.bitwig.extensions.controllers.akai.apc64.HardwareElements;
import com.bitwig.extensions.controllers.akai.apc64.Menu;
import com.bitwig.extensions.controllers.akai.apc64.ModifierStates;
import com.bitwig.extensions.controllers.akai.apc64.PadMode;
import com.bitwig.extensions.controllers.akai.apc64.ViewControl;
import com.bitwig.extensions.controllers.akai.apc64.control.OledBacklight;
import com.bitwig.extensions.controllers.akai.apc64.control.SingleLedButton;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;
import com.bitwig.extensions.framework.di.Activate;
import com.bitwig.extensions.framework.di.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class MainDisplay {

    private final Layer mainLayer;
    private final Groove groove;
    private final Menu bitwigMenu;
    private final OledBacklight oledBacklight;
    private final DeviceControl deviceControl;
    private final ApcPreferences preferences;
    private boolean swingModeActive;
    private Screen currentScreen;

    private final double[] FIXED_LENGTH_PRESET_VALUES = {1, 2, 4, 8, 12, 16, 20, 24, 28, 32.0, 40, 48, 56, 64};
    private final String[] RECORD_QUANTIZE = {"OFF", "1/32", "1/16", "1/8", "1/4"};

    private final Map<ScreenMode, Screen> screens = new HashMap<>();

    private final ControllerHost host;

    private final ViewControl viewControl;
    private final Apc64MidiProcessor midiProcessor;
    private long releaseTime = -1;
    private long currentReleaseTime = 1000;
    private final Transport transport;

    private final SettableEnumValue recordQuantizeGrid;
    private SettableEnumValue postRecordingAction;
    private SettableBeatTimeValue postRecordingTimeOffset;
    private final SettableBooleanValue recordQuantizeLength;
    private EncoderMode encoderMode = EncoderMode.TRACK;
    private int touchCount = 0;

    private final ModifierStates modifierStates;

    public enum ScreenMode {
        MAIN,
        PARAMETER,
        METRO,
        FIXED,
        RECORD_QUANTIZE,
        LAUNCH_QUANTIZE,
        MENU(true),
        TEMPO,
        INFO;

        private final boolean hasEmptyBackLight;

        ScreenMode() {
            this(false);
        }

        ScreenMode(final boolean hasEmptyBackLight) {
            this.hasEmptyBackLight = hasEmptyBackLight;
        }
    }

    private enum EncoderMode {
        TRACK,
        FIXED,
        RECORD_QUANTIZE,
        MENU,
        TEMPO
    }

    public class Screen {
        private final String[] rows = {"", "", ""};
        private boolean active;
        private final ScreenMode mode;

        public Screen(final ScreenMode mode) {
            this.mode = mode;
        }

        public ScreenMode getMode() {
            return mode;
        }

        public void setScreen(final String row1, final String row2, final String row3) {
            setRow(0, row1);
            setRow(1, row2);
            setRow(2, row3);
        }

        public void setRow(final int row, final String value) {
            if (!rows[row].equals(value)) {
                rows[row] = value;
                if (active) {
                    midiProcessor.sendText(row, value);
                }
            }
        }

        public void setActive(final boolean active) {
            if (active != this.active) {
                this.active = active;
                if (active) {
                    refresh();
                }
            }
        }

        public void refresh() {
            for (int i = 0; i < 3; i++) {
                midiProcessor.sendText(i, rows[i]);
            }
        }
    }

    public MainDisplay(final Layers layers, final HardwareElements hwElements, final ViewControl viewControl,
                       final Apc64MidiProcessor midiProcessor, final ControllerHost host, final Transport transport,
                       final Application application, final ModifierStates modifierStates,
                       final ApcPreferences preferences) {
        mainLayer = new Layer(layers, "ENCODER_LAYER");
        this.viewControl = viewControl;
        this.midiProcessor = midiProcessor;
        this.host = host;
        this.transport = transport;
        this.modifierStates = modifierStates;
        this.oledBacklight = hwElements.getOledBackLight();
        this.preferences = preferences;

        Arrays.stream(ScreenMode.values()).forEach(mode -> screens.put(mode, new Screen(mode)));
        final Screen mainScreen = screens.get(ScreenMode.MAIN);

        hwElements.getMainEncoder().bind(mainLayer, this::handleEncoder);
        viewControl.getCursorTrack().name().addValueObserver(name -> mainScreen.setRow(0, name));

        deviceControl = viewControl.getDeviceControl();
        deviceControl.getDeviceName().addValueObserver(name -> toScreen(ScreenMode.MAIN, 1, name));
        deviceControl.getPageName().addValueObserver(name -> toScreen(ScreenMode.MAIN, 2, name));
        transport.isMetronomeEnabled()
                .addValueObserver(metroActive -> toScreen(ScreenMode.METRO, 2, metroActive ? "On" : "Off"));


        recordQuantizeGrid = application.recordQuantizationGrid();
        recordQuantizeGrid.addValueObserver(value -> toScreen(ScreenMode.RECORD_QUANTIZE, 2, value));
        recordQuantizeLength = application.recordQuantizeNoteLength();
        recordQuantizeLength.markInterested();
        this.groove = host.createGroove();
        this.groove.getEnabled().markInterested();

        currentScreen = mainScreen;
        currentScreen.setActive(true);
        bitwigMenu = new Menu(screens.get(ScreenMode.MENU));
        initBitwigMenu();
        hwElements.getOledBackLight().bind(mainLayer, () -> RgbLightState.of(viewControl.getCursorTrackColor()));
        hwElements.getEncoderPress().bindIsPressed(mainLayer, this::handleBasicClick);
        host.scheduleTask(this::handlePing, 100);
        initFixedLengthEdit(hwElements);
        initQuantizeEdit(hwElements);
        initTempoEdit(hwElements);

        midiProcessor.addModeChangeListener(newMode -> {
            if (newMode == PadMode.DRUM) {
                currentScreen.refresh();
                midiProcessor.activateDawMode(true);
            }
        });
    }

    public void refresh() {
        currentScreen.refresh();
    }

    public void initBitwigMenu() {
        transport.automationWriteMode().markInterested();
        transport.isArrangerAutomationWriteEnabled().markInterested();
        final String[] autoWriteModeValues = {"latch", "touch", "write"};
        // TODO Exit with long press
        // TODO Improved Value Handling int/double.
        bitwigMenu.addMenuItem(new Menu.HoldMenuItem("ALT Modifier", modifierStates.getAltActive()));
        bitwigMenu.addMenuItem(new Menu.EnumMenuItem("Auto W.Mode", transport.automationWriteMode(),
                List.of(new Menu.EnumMenuValue("latch", "LATCH"),
                        new Menu.EnumMenuValue("touch", "TOUCH"),
                        new Menu.EnumMenuValue("write", "WRITE"))));
        bitwigMenu.addMenuItem(
                new Menu.BooleanToggleMenuItem("Arrange Auto", transport.isArrangerAutomationWriteEnabled()));
        bitwigMenu.addMenuItem(
                new Menu.BooleanToggleMenuItem("Launch Auto", transport.isClipLauncherAutomationWriteEnabled()));
        bitwigMenu.addMenuItem(new Menu.BooleanToggleMenuItem("SHIFT as ALT", preferences.getAltModeWithShift()));
        //bitwigMenu.addMenuItem(new Menu.BooleanMenuItem("Groove Enabled", ));
        bitwigMenu.addMenuItem(new Menu.EnumMenuItem("Grid Layout", preferences.getGridLayoutSettings(),
                List.of(new Menu.EnumMenuValue(OrientationFollowType.AUTOMATIC.getLabel(),
                                OrientationFollowType.AUTOMATIC.getShortLabel()),
                        new Menu.EnumMenuValue(OrientationFollowType.FIXED_VERTICAL.getLabel(),
                                OrientationFollowType.FIXED_VERTICAL.getShortLabel()),
                        new Menu.EnumMenuValue(OrientationFollowType.FIXED_HORIZONTAL.getLabel(),
                                OrientationFollowType.FIXED_HORIZONTAL.getShortLabel()))));

        bitwigMenu.init();
    }

    @Activate
    public void init() {
        mainLayer.setIsActive(true);
    }

    private void toScreen(final ScreenMode mode, final int row, final String value) {
        screens.get(mode).setRow(row, value);
    }

    private void initQuantizeEdit(final HardwareElements hwElements) {
        final SingleLedButton quantizeButton = hwElements.getButton(Apc64CcAssignments.QUANTIZE);

        quantizeButton.bindIsPressed(mainLayer, this::handleQuantizePressed);
        quantizeButton.bindLightPressed(mainLayer,
                pressed -> pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_10);
    }

    private void handleQuantizePressed(final boolean pressed) {
        modifierStates.getQuantizeActive().set(pressed);
        if (modifierStates.isShift()) {
            if (pressed) {
                activatePageDisplay(ScreenMode.RECORD_QUANTIZE, "RecordQuantize", recordQuantizeGrid.get());
                encoderMode = EncoderMode.RECORD_QUANTIZE;
            } else {
                returnToMain();
                encoderMode = EncoderMode.TRACK;
            }
        } else {
            // No Quantize Value available via API
        }
    }

    private void initFixedLengthEdit(final HardwareElements hwElements) {
        final SingleLedButton fixedLengthButton = hwElements.getButton(Apc64CcAssignments.FIXED);
        postRecordingTimeOffset = transport.getClipLauncherPostRecordingTimeOffset();
        postRecordingAction = transport.clipLauncherPostRecordingAction();
        postRecordingAction.markInterested();
        postRecordingTimeOffset.markInterested();
        postRecordingTimeOffset.addValueObserver(v -> {
            toScreen(ScreenMode.FIXED, 2, beatValueToString(v));
        });
        fixedLengthButton.bindDelayedHold(mainLayer, this::toggleFixedMode, this::editFixedLength, 500);
        fixedLengthButton.bindLight(mainLayer, pressed -> postRecordingAction.get()
                .equals("play_recorded") ? (pressed ? VarSingleLedState.PULSE_4 : VarSingleLedState.FULL) : VarSingleLedState.LIGHT_10);
    }

    private void initTempoEdit(final HardwareElements hwElements) {
        final SingleLedButton button = hwElements.getButton(Apc64CcAssignments.TEMPO);
        modifierStates.getShiftActive().addValueObserver(active -> {
            if (!active && swingModeActive) {
                setSwingActive(false);
            }
        });
        //button.bindDelayedHold(mainLayer, () -> transport.tapTempo(), this::handleTempoPressed, 400);
        button.bindIsPressed(mainLayer, this::handleTempoPressed);
        transport.tempo().value().markInterested();
        transport.tempo().displayedValue().markInterested();
        transport.tempo().displayedValue().addValueObserver(value -> toScreen(ScreenMode.TEMPO, 2, value));
    }

    private void handleTempoPressed(final boolean pressed) {
        if (pressed) {
            if (modifierStates.isShift()) {
                setSwingActive(true);
            } else {
                transport.tapTempo();
                encoderMode = EncoderMode.TEMPO;
                activatePageDisplay(ScreenMode.TEMPO, "Tempo", transport.tempo().displayedValue().get(), 500);
            }
        } else {
            setSwingActive(false);
            encoderMode = EncoderMode.TRACK;
            notifyRelease();
        }
    }

    private void setSwingActive(final boolean active) {
        if (this.swingModeActive != active) {
            this.swingModeActive = active;
            if (active) {
                midiProcessor.exitSessionMode();
                midiProcessor.sendMidi(0x96, 0x48, 0x7f);
            } else {
                midiProcessor.enterSessionMode();
                midiProcessor.sendMidi(0x96, 0x48, 0x00);
            }
        }
    }

    public void notifyRelease() {
        releaseTime = System.currentTimeMillis();
    }

    private void editFixedLength(final boolean held) {
        if (held) {
            activatePageDisplay(ScreenMode.FIXED, "Fixed Length", beatValueToString(postRecordingTimeOffset.get()));
            encoderMode = EncoderMode.FIXED;
        } else {
            returnToMain();
            encoderMode = EncoderMode.TRACK;
        }
    }

    private void toggleFixedMode() {
        if (postRecordingAction.get().equals("play_recorded")) {
            postRecordingAction.set("off");
        } else {
            postRecordingAction.set("play_recorded");
        }
    }

    private void handlePing() {
        if (releaseTime != -1 && (System.currentTimeMillis() - releaseTime) > currentReleaseTime) {
            changeScreenMode(stashedMode == null ? ScreenMode.MAIN : stashedMode);
            releaseTime = -1;
            stashedMode = null;
            if (!midiProcessor.modeHasTextControl() && midiProcessor.isSessionModeState()) {
                midiProcessor.exitSessionMode();
            }
        }
        host.scheduleTask(this::handlePing, 100);
    }

    private void handleBasicClick(final boolean pressed) {
        if (encoderMode == EncoderMode.TRACK) {
            handleClickMainMode(pressed);
        } else if (encoderMode == EncoderMode.MENU) {
            handleMenuClick(pressed);
        } else if (encoderMode == EncoderMode.RECORD_QUANTIZE) {
            if (pressed) {
                recordQuantizeLength.toggle();
                activatePageDisplay(ScreenMode.RECORD_QUANTIZE, "RecordQ.Len",
                        recordQuantizeLength.get() ? "OFF" : "ON");
            } else {
                activatePageDisplay(ScreenMode.RECORD_QUANTIZE, "RecordQuantize", recordQuantizeGrid.get());
            }
        }
    }

    private void handleClickMainMode(final boolean pressed) {
        if (modifierStates.isShift()) {
            if (pressed) {
                if (currentScreen.getMode() == ScreenMode.MAIN && encoderMode != EncoderMode.MENU) {
                    encoderMode = EncoderMode.MENU;
                    changeScreenMode(ScreenMode.MENU);
                }
            }
        } else {
            if (pressed) {
                activatePageDisplay(ScreenMode.METRO, "Metronome", "");
                transport.isMetronomeEnabled().toggle();
            } else {
                releaseToMain(500);
            }
        }
    }

    private String beatValueToString(final double v) {
        final double bars = v / 4;
        if (bars == 1.0) {
            return "1 Bar";
        } else if (bars > 1) {
            return "%d Bars".formatted((int) bars);
        } else {
            return "%d Beats".formatted((int) v);
        }
    }

    private void handleEncoder(final int dir) {
        if (encoderMode == EncoderMode.TRACK) {
            if (dir < 0) {
                viewControl.getCursorTrack().selectPrevious();
            } else {
                viewControl.getCursorTrack().selectNext();
            }
        } else if (encoderMode == EncoderMode.FIXED) {
            final int current = valueIndex(postRecordingTimeOffset.get(), FIXED_LENGTH_PRESET_VALUES);
            final int next = current + dir;
            if (next >= 0 && next < FIXED_LENGTH_PRESET_VALUES.length) {
                postRecordingTimeOffset.set(FIXED_LENGTH_PRESET_VALUES[next]);
            }
        } else if (encoderMode == EncoderMode.RECORD_QUANTIZE) {
            final int current = valueIndex(recordQuantizeGrid.get(), RECORD_QUANTIZE);
            final int next = current + dir;
            if (next >= 0 && next < RECORD_QUANTIZE.length) {
                recordQuantizeGrid.set(RECORD_QUANTIZE[next]);
            }
        } else if (encoderMode == EncoderMode.TEMPO) {
            double value = transport.tempo().getRaw();
            value += dir;
            transport.tempo().setRaw(value);
        } else if (encoderMode == EncoderMode.MENU) {
            handleMenuEncoder(dir);
        }
    }

    private void handleMenuEncoder(final int dir) {
        bitwigMenu.handleInc(dir);
    }

    private void handleMenuClick(final boolean pressed) {
        if (modifierStates.isShift() && pressed) {
            encoderMode = EncoderMode.TRACK;
            returnToMain();
        } else {
            bitwigMenu.handEncoderClick(pressed);
        }
    }

    private int valueIndex(final String value, final String[] values) {
        for (int i = 0; i < values.length; i++) {
            if (value.equals(values[i])) {
                return i;
            }
        }
        return -1;
    }

    private int valueIndex(final double value, final double[] values) {
        for (int i = 0; i < values.length; i++) {
            if (values[i] == value) {
                return i;
            }
        }
        for (int i = 0; i < values.length - 1; i++) {
            final double v1 = values[i];
            final double v2 = values[i + 1];
            if (v1 < value && value < v2) {
                if (Math.abs(v1 - value) < Math.abs(v2 - value)) {
                    return i;
                } else {
                    return i + 1;
                }
            }
        }
        return values.length - 1;
    }

    public void setParameterValue(final String value) {
        toScreen(ScreenMode.PARAMETER, 2, value);
    }

    public void activatePageDisplay(final ScreenMode mode, final String parameterName, final String value) {
        final Screen screen = screens.get(mode);
        screen.setRow(0, "");
        screen.setRow(1, parameterName);
        screen.setRow(2, value);
        changeScreenMode(mode);
        midiProcessor.enterSessionMode();
        releaseTime = -1;
    }

    public void activatePageDisplay(final ScreenMode mode, final String parameterName, final String value,
                                    final long releaseTime) {
        activatePageDisplay(mode, parameterName, value);
        midiProcessor.enterSessionMode();
        currentReleaseTime = releaseTime;
    }

    public void enterMode(final ScreenMode mode, final String parameterName, final String value) {
        final Screen screen = screens.get(mode);
        screen.setRow(0, "");
        screen.setRow(1, parameterName);
        screen.setRow(2, value);
        changeScreenMode(mode);
        releaseToMain(2000);
    }

    public void returnToMain() {
        changeScreenMode(ScreenMode.MAIN);
    }

    private ScreenMode stashedMode = null;

    public void touchParameter(final String destination, final String parameterName, final String value) {
        final Screen screen = screens.get(ScreenMode.PARAMETER);

        screen.setRow(0, destination);
        screen.setRow(1, parameterName);
        screen.setRow(2, value);
        midiProcessor.enterSessionMode();
        if (currentScreen.getMode() != ScreenMode.PARAMETER) {
            stashedMode = currentScreen.getMode();
            changeScreenMode(ScreenMode.PARAMETER);
        }
        touchCount++;
        releaseTime = -1;
    }

    public void releaseToMain(final long waitTime) {
        releaseTime = System.currentTimeMillis();
        currentReleaseTime = waitTime;
    }

    public void releaseTouchParameter(final int sliderIndex) {
        touchCount--;
        if (touchCount <= 0) {
            releaseToMain(1500);
            touchCount = 0;
        }
    }

    public void changeScreenMode(final ScreenMode mode) {
        if (mode != currentScreen.getMode()) {
            currentScreen.setActive(false);
            final boolean changeBackLight = mode.hasEmptyBackLight != currentScreen.getMode().hasEmptyBackLight;
            currentScreen = screens.get(mode);
            if (changeBackLight) {
                if (mode.hasEmptyBackLight) {
                    midiProcessor.sendMidi(0xB0, 0x59, 0);
                } else {
                    midiProcessor.sendMidi(0xB0, 0x59, oledBacklight.getState());
                }
            }
            currentScreen.setActive(true);
        }
    }

}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/layer/NavigationLayer.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.layer;

import java.util.function.BooleanSupplier;

import com.bitwig.extension.controller.api.BooleanValue;
import com.bitwig.extension.controller.api.SendBank;
import com.bitwig.extension.controller.api.TrackBank;
import com.bitwig.extensions.controllers.akai.apc.common.PanelLayout;
import com.bitwig.extensions.controllers.akai.apc.common.led.VarSingleLedState;
import com.bitwig.extensions.controllers.akai.apc64.Apc64CcAssignments;
import com.bitwig.extensions.controllers.akai.apc64.Apc64MidiProcessor;
import com.bitwig.extensions.controllers.akai.apc64.ApcPreferences;
import com.bitwig.extensions.controllers.akai.apc64.DeviceControl;
import com.bitwig.extensions.controllers.akai.apc64.HardwareElements;
import com.bitwig.extensions.controllers.akai.apc64.ModifierStates;
import com.bitwig.extensions.controllers.akai.apc64.PadMode;
import com.bitwig.extensions.controllers.akai.apc64.ViewControl;
import com.bitwig.extensions.controllers.akai.apc64.control.SingleLedButton;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;
import com.bitwig.extensions.framework.di.Activate;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.di.Inject;
import com.bitwig.extensions.framework.values.ValueObject;

@Component
public class NavigationLayer {
    
    @Inject
    private PadLayer padLayer;
    
    private final Layer sessionNavigationVertical;
    private final Layer sessionNavigationHorizontal;
    private final Layer padNavigation;
    private final Layer deviceNavLayer;
    private final Layer sendsNavLayer;
    private final ViewControl viewControl;
    private final ModifierStates modifierState;
    private final TrackBank trackBank;
    private final ValueObject<PanelLayout> panelLayout;
    private PadMode currentMode = PadMode.SESSION;
    
    public NavigationLayer(final Layers layers, final HardwareElements hwElement, final ViewControl viewControl,
        final ModifierStates modifierStates, final ApcPreferences preferences, final Apc64MidiProcessor midiProcessor) {
        sessionNavigationVertical = new Layer(layers, "SESSION_NAVIGATION_VERTICAL");
        sessionNavigationHorizontal = new Layer(layers, "SESSION_NAVIGATION_HORIZONTAL");
        padNavigation = new Layer(layers, "PAD_LAYER_NAVIGATION");
        this.deviceNavLayer = new Layer(layers, "DEVICE_NAVIGATION");
        this.sendsNavLayer = new Layer(layers, "SENDS_NAVIGATION");
        this.viewControl = viewControl;
        this.modifierState = modifierStates;
        this.trackBank = viewControl.getTrackBank();
        this.panelLayout = preferences.getPanelLayout();
        this.panelLayout.addValueObserver(newValue -> {
            this.sessionNavigationVertical.setIsActive(newValue == PanelLayout.VERTICAL);
            this.sessionNavigationHorizontal.setIsActive(newValue == PanelLayout.HORIZONTAL);
        });
        midiProcessor.addModeChangeListener(this::handleModeChange);
        
        initSessionNavigation(sessionNavigationVertical, hwElement, Apc64CcAssignments.NAV_DOWN,
            Apc64CcAssignments.NAV_UP, Apc64CcAssignments.NAV_LEFT, Apc64CcAssignments.NAV_RIGHT);
        initSessionNavigation(sessionNavigationHorizontal, hwElement, Apc64CcAssignments.NAV_LEFT,
            Apc64CcAssignments.NAV_RIGHT, Apc64CcAssignments.NAV_DOWN, Apc64CcAssignments.NAV_UP);
        initPadLayerNavigation(padNavigation, hwElement);
        initDeviceNavigation(deviceNavLayer, hwElement);
        initSendsNavigation(sendsNavLayer, hwElement);
    }
    
    private void handleModeChange(final PadMode mode) {
        this.currentMode = mode;
        activateSessionNavigation(true);
    }
    
    @Activate
    public void activateLayer() {
        this.sessionNavigationVertical.setIsActive(panelLayout.get() == PanelLayout.VERTICAL);
        this.sessionNavigationHorizontal.setIsActive(panelLayout.get() == PanelLayout.HORIZONTAL);
    }
    
    private void initSessionNavigation(final Layer layer, final HardwareElements hwElements,
        final Apc64CcAssignments downButton, final Apc64CcAssignments upButton, final Apc64CcAssignments leftButton,
        final Apc64CcAssignments rightButton) {
        final SingleLedButton navDown = hwElements.getButton(downButton);
        navDown.bindRepeatHold(layer, () -> handleSessionVertical(-1));
        navDown.bindLightPressed(layer, pressed -> canNavigateVertical(pressed, -1));
        
        final SingleLedButton navUp = hwElements.getButton(upButton);
        navUp.bindRepeatHold(layer, () -> handleSessionVertical(1));
        navUp.bindLightPressed(layer, pressed -> canNavigateVertical(pressed, 1));
        
        final SingleLedButton navLeft = hwElements.getButton(leftButton);
        navLeft.bindRepeatHold(layer, () -> handleSessionHorizontal(-1));
        navLeft.bindLightPressed(layer, pressed -> canNavigateHorizontal(pressed, -1));
        
        final SingleLedButton navRight = hwElements.getButton(rightButton);
        navRight.bindRepeatHold(layer, () -> handleSessionHorizontal(1));
        navRight.bindLightPressed(layer, pressed -> canNavigateHorizontal(pressed, 1));
    }
    
    private void initPadLayerNavigation(final Layer layer, final HardwareElements hwElements) {
        final SingleLedButton navDown = hwElements.getButton(Apc64CcAssignments.NAV_DOWN);
        navDown.bindRepeatHold(layer, () -> handlePadModeNavigation(-1));
        navDown.bindLightPressed(layer, pressed -> canNavigatePadMode(pressed, -1));
        
        final SingleLedButton navUp = hwElements.getButton(Apc64CcAssignments.NAV_UP);
        navUp.bindRepeatHold(layer, () -> handlePadModeNavigation(1));
        navUp.bindLightPressed(layer, pressed -> canNavigatePadMode(pressed, 1));
        
        final SingleLedButton navLeft = hwElements.getButton(Apc64CcAssignments.NAV_LEFT);
        navLeft.bindIsPressed(layer, pressed -> {
        });
        navLeft.bindLight(layer, () -> VarSingleLedState.OFF);
        
        final SingleLedButton navRight = hwElements.getButton(Apc64CcAssignments.NAV_RIGHT);
        navRight.bindIsPressed(layer, pressed -> {
        });
        navRight.bindLight(layer, () -> VarSingleLedState.OFF);
    }
    
    private void handlePadModeNavigation(final int dir) {
        final int amount = modifierState.isShift() ? dir * 16 : dir * 4;
        padLayer.navigateBy(amount);
    }
    
    public VarSingleLedState canNavigatePadMode(final boolean pressedState, final int dir) {
        final int amount = modifierState.isShift() ? dir * 8 : dir * 4;
        if (padLayer.canNavigateBy(amount)) {
            return pressedState ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
        }
        return VarSingleLedState.OFF;
    }
    
    public void handleSessionVertical(final int dir) {
        final int amount = modifierState.isShift() ? dir * 8 : dir;
        trackBank.sceneBank().scrollBy(amount);
    }
    
    public void handleSessionHorizontal(final int dir) {
        final int amount = modifierState.isShift() ? dir * 8 : dir;
        trackBank.scrollBy(amount);
    }
    
    public VarSingleLedState canNavigateVertical(final boolean pressedState, final int dir) {
        final int amount = modifierState.isShift() ? dir * 8 : dir;
        if (viewControl.canScrollVertical(amount)) {
            return pressedState ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
        }
        return VarSingleLedState.OFF;
    }
    
    public VarSingleLedState canNavigateHorizontal(final boolean pressedState, final int dir) {
        final int amount = modifierState.isShift() ? dir * 8 : dir;
        if (viewControl.canScrollHorizontal(amount)) {
            return pressedState ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
        }
        return VarSingleLedState.OFF;
    }
    
    private void initDeviceNavigation(final Layer layer, final HardwareElements hwElements) {
        final DeviceControl deviceControl = viewControl.getDeviceControl();
        final SingleLedButton leftNav = hwElements.getButton(Apc64CcAssignments.NAV_LEFT);
        final SingleLedButton rightNav = hwElements.getButton(Apc64CcAssignments.NAV_RIGHT);
        final SingleLedButton upNav = hwElements.getButton(Apc64CcAssignments.NAV_UP);
        final SingleLedButton downNav = hwElements.getButton(Apc64CcAssignments.NAV_DOWN);
        
        rightNav.bindPressed(layer, () -> deviceControl.selectDevice(1));
        rightNav.bindLightPressed(layer, pressed -> canNavigate(pressed, () -> deviceControl.canScrollDevices(1)));
        leftNav.bindPressed(layer, () -> deviceControl.selectDevice(-1));
        rightNav.bindLightPressed(layer, pressed -> canNavigate(pressed, () -> deviceControl.canScrollDevices(-1)));
        
        upNav.bindPressed(layer, () -> navigateDeviceVertical(deviceControl, 1));
        upNav.bindLightPressed(layer, pressed -> canNavigateVertical(pressed, deviceControl, 1));
        downNav.bindPressed(layer, () -> navigateDeviceVertical(deviceControl, -1));
        downNav.bindLightPressed(layer, pressed -> canNavigateVertical(pressed, deviceControl, -1));
    }
    
    private void navigateDeviceVertical(final DeviceControl deviceControl, final int dir) {
        if (modifierState.isShift()) {
            deviceControl.navigateVertical(dir);
        } else {
            deviceControl.selectParameterPage(dir);
        }
    }
    
    private VarSingleLedState canNavigateVertical(final boolean pressed, final DeviceControl deviceControl,
        final int dir) {
        if (modifierState.isShift()) {
            if (deviceControl.canNavigateIntoDevice(dir)) {
                return pressed ? VarSingleLedState.FULL : VarSingleLedState.PULSE_2;
            }
        } else {
            if (deviceControl.canScrollParameterPages(dir)) {
                return pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
            }
        }
        return VarSingleLedState.OFF;
    }
    
    
    private void initSendsNavigation(final Layer layer, final HardwareElements hwElements) {
        final SingleLedButton leftNav = hwElements.getButton(Apc64CcAssignments.NAV_LEFT);
        final SingleLedButton rightNav = hwElements.getButton(Apc64CcAssignments.NAV_RIGHT);
        final SingleLedButton upNav = hwElements.getButton(Apc64CcAssignments.NAV_UP);
        final SingleLedButton downNav = hwElements.getButton(Apc64CcAssignments.NAV_DOWN);
        for (int i = 0; i < viewControl.getTrackBank().getSizeOfBank(); i++) {
            final SendBank sendsBank = viewControl.getTrackBank().getItemAt(i).sendBank();
            sendsBank.canScrollBackwards().markInterested();
            sendsBank.canScrollForwards().markInterested();
            sendsBank.scrollPosition().markInterested();
        }
        final SendBank sendsBank = viewControl.getTrackBank().getItemAt(0).sendBank();
        rightNav.bindPressed(layer, this::scrollSendsBackward);
        rightNav.bindLightPressed(layer, pressed -> canNavigate(pressed, sendsBank.canScrollBackwards()));
        leftNav.bindPressed(layer, this::scrollSendsForward);
        leftNav.bindLightPressed(layer, pressed -> canNavigate(pressed, sendsBank.canScrollForwards()));
        
        downNav.bindPressed(layer, () -> {
        });
        downNav.bindLightPressed(layer, pressed -> VarSingleLedState.OFF);
        upNav.bindPressed(layer, () -> {
        });
        upNav.bindLightPressed(layer, pressed -> VarSingleLedState.OFF);
    }
    
    private void scrollSendsForward() {
        final TrackBank bank = viewControl.getTrackBank();
        for (int i = 0; i < bank.getSizeOfBank(); i++) {
            bank.getItemAt(i).sendBank().scrollForwards();
        }
    }
    
    private void scrollSendsBackward() {
        final TrackBank bank = viewControl.getTrackBank();
        for (int i = 0; i < bank.getSizeOfBank(); i++) {
            bank.getItemAt(i).sendBank().scrollBackwards();
        }
    }
    
    
    public void navigateSends() {
        final TrackBank bank = viewControl.getTrackBank();
        
        for (int i = 0; i < bank.getSizeOfBank(); i++) {
            scrollRoundRobin(bank.getItemAt(i).sendBank());
        }
        
    }
    
    private void scrollRoundRobin(final SendBank sendBank) {
        if (sendBank.canScrollForwards().get()) {
            sendBank.scrollForwards();
        } else {
            sendBank.scrollPosition().set(0);
        }
    }
    
    
    private VarSingleLedState canNavigate(final boolean pressed, final BooleanValue value) {
        if (value.get()) {
            return pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
        }
        return VarSingleLedState.OFF;
    }
    
    private VarSingleLedState canNavigate(final boolean pressed, final BooleanSupplier value) {
        if (value.getAsBoolean()) {
            return pressed ? VarSingleLedState.FULL : VarSingleLedState.LIGHT_25;
        }
        return VarSingleLedState.OFF;
    }
    
    public void setDeviceNavigationActive(final boolean active) {
        sendsNavLayer.setIsActive(false);
        deviceNavLayer.setIsActive(active);
        activateSessionNavigation(!active);
    }
    
    public void setSendsNavigationActive(final boolean active) {
        deviceNavLayer.setIsActive(false);
        sendsNavLayer.setIsActive(active);
        activateSessionNavigation(!active);
    }
    
    public void activateSessionNavigation(final boolean active) {
        if (active) {
            if (currentMode == PadMode.SESSION || currentMode == PadMode.OVERVIEW) {
                this.sessionNavigationVertical.setIsActive(panelLayout.get() == PanelLayout.VERTICAL);
                this.sessionNavigationHorizontal.setIsActive(panelLayout.get() == PanelLayout.HORIZONTAL);
                this.padNavigation.setIsActive(false);
            } else if (currentMode == PadMode.DRUM) {
                sessionNavigationVertical.setIsActive(false);
                sessionNavigationHorizontal.setIsActive(false);
                this.padNavigation.setIsActive(true);
            }
        } else {
            sessionNavigationVertical.setIsActive(false);
            sessionNavigationHorizontal.setIsActive(false);
            padNavigation.setIsActive(false);
        }
    }
    
}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/layer/OverviewLayer.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.layer;

import com.bitwig.extensions.controllers.akai.apc.common.control.RgbButton;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc64.HardwareElements;
import com.bitwig.extensions.controllers.akai.apc64.ViewControl;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;


public class OverviewLayer extends Layer {

    private final ViewControl viewControl;

    public OverviewLayer(final Layers layers, ViewControl viewControl, HardwareElements hwElements) {
        super(layers, "OVERVIEW_LAYER");
        this.viewControl = viewControl;
        for (int i = 0; i < 8; i++) {
            final int trackIndex = i;
            for (int j = 0; j < 8; j++) {
                final int sceneIndex = j;
                final RgbButton button = hwElements.getGridButton(sceneIndex, trackIndex);
                button.bindPressed(this, () -> handleSelection(trackIndex, sceneIndex));
                button.bindLight(this, () -> getState(trackIndex, sceneIndex));
            }
        }
    }

    private void handleSelection(final int trackIndex, final int sceneIndex) {
        viewControl.scrollToOverview(trackIndex, sceneIndex);
    }

    private RgbLightState getState(final int trackIndex, final int sceneIndex) {
        if (viewControl.inOverviewGridFocus(trackIndex, sceneIndex)) {
            if (viewControl.hasClips(trackIndex, sceneIndex)) {
                return RgbLightState.ORANGE_SEL;
            }
            return RgbLightState.WHITE_SEL;
        }
        if (viewControl.hasClips(trackIndex, sceneIndex)) {
            return RgbLightState.ORANGE_FULL;
        }
        if (viewControl.inOverviewGrid(trackIndex, sceneIndex)) {
            return RgbLightState.WHITE_DIM;
        }
        return RgbLightState.OFF;
    }
}


================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/layer/PadLayer.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.layer;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.control.RgbButton;
import com.bitwig.extensions.controllers.akai.apc.common.led.ColorLookup;
import com.bitwig.extensions.controllers.akai.apc.common.led.LedBehavior;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc64.*;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.di.Inject;
import com.bitwig.extensions.framework.di.PostConstruct;

import java.util.Arrays;

@Component
public class PadLayer extends Layer {

    private static final int[] VEL_TABLE = {5, 10, 25, 60, 75, 90, 100, 127};
    private static final int[] FIXED_COLORS = {42, 42, 41, 41, 46, 46, 45, 45};

    private final double[] rateTable = {0.0833333, 0.125, 0.1666666, 0.25, 0.33333, 0.5, 0.666666, 1.0};

    //private final double[] rateTable = {0.125, 0.25, 0.5, 1.0, 2.0};
    //private final String[] rateDisplayValues = {"1/32T", "1/32", "1/16T", "1/16", "1/8T", "1/8", "1/4T", "1/4"};

    private final double[] arpRateTable = {1.0, 0.5, 0.33333, 0.25, 0.1666666, 0.125, 0.0833333, 0.0625};
    private final String[] rateDisplayValues = {"1/4", "1/8", "1/8T", "1/16", "1/16T", "1/32", "1/32T", "1/64"};
    private static final int[] ARP_COLORS = {53, 53, 56, 53, 56, 53, 56, 53};

    @Inject
    private MainDisplay mainDisplay;
    @Inject
    private FocusClip focusClip;
    private final ModifierStates states;

    private final Apc64MidiProcessor midiProcessor;
    private final ViewControl viewControl;
    private final DrumPadBank drumPadBank;
    private final NoteInput noteInput;
    private PadMode currentMode = PadMode.SESSION;
    private boolean inDrumMode = false;

    private final Layer shiftLayer;
    private final Layer clearLayer;
    private final Layer muteLayer;
    private final Layer soloLayer;

    protected final int[] padToNote = new int[16];
    private final Integer[] noteTable = new Integer[128];
    private final Integer[] velocityTable = new Integer[128];
    private final int[] padColors = new int[16];
    private final boolean[] isSelected = new boolean[16];
    private final boolean[] isPlaying = new boolean[128];
    private int padOffset = 36;
    private int fixedVelocity = -1;
    private int selectedVelocityIndex = -1;
    private int selectedNoteRepeatIndex = -1;
    private int soloHeld = 0;
    private final Arpeggiator arp;

    public PadLayer(Layers layers, ViewControl viewControl, Apc64MidiProcessor midiProcessor, ModifierStates states) {
        super(layers, "PAD_LAYER");

        this.shiftLayer = new Layer(layers, "PAD_SHIFT_LAYER");
        this.clearLayer = new Layer(layers, "PAD_CLEAR_LAYER");
        this.muteLayer = new Layer(layers, "PAD_MUTE_LAYER");
        this.soloLayer = new Layer(layers, "PAD_SOLO_LAYER");
        this.midiProcessor = midiProcessor;
        this.noteInput = midiProcessor.getNoteInput();
        arp = noteInput.arpeggiator();
        initArp();
        this.viewControl = viewControl;
        this.states = states;
        viewControl.getCursorTrack().playingNotes().addValueObserver(this::handleNotes);
        this.states.getShiftActive().addValueObserver(mod -> applyLayers());
        this.states.getClearActive().addValueObserver(mod -> applyLayers());
        PinnableCursorDevice primaryDevice = viewControl.getDeviceControl().getPrimaryDevice();
        primaryDevice.hasDrumPads().addValueObserver(this::handleHasDrumPadsChanged);
        drumPadBank = viewControl.getDeviceControl().getDrumPadBank();
        drumPadBank.scrollPosition().addValueObserver(this::handlePadBankScrolling);

        Arrays.fill(padColors, 0);
        Arrays.fill(noteTable, -1);
        Arrays.fill(padToNote, -1);
        setVelocity(-1);
        midiProcessor.addModeChangeListener(currentMode -> {
            this.currentMode = currentMode;
            if (isActive()) {
                midiProcessor.restoreState();
            }
        });
    }

    public void duplicateContent() {
        if (inDrumMode) {
            focusClip.duplicateContent();
        }
    }

    private void initArp() {
        arp.isEnabled().markInterested();
        arp.usePressureToVelocity().markInterested();
        arp.usePressureToVelocity().set(true);
        arp.octaves().markInterested();
        arp.rate().markInterested();
        arp.mode().markInterested();
        arp.rate().set(arpRateTable[0]);
    }

    private void setVelocity(int fixedValue) {
        for (int i = 0; i < 128; i++) {
            velocityTable[i] = fixedValue == -1 ? i : fixedValue;
        }
    }

    @PostConstruct
    public void init(HardwareElements hwElements) {
        for (int i = 0; i < 4; i++) {
            final int columnIndex = i;
            for (int j = 0; j < 4; j++) {
                final int rowIndex = j;
                int padIndex = rowIndex * 4 + columnIndex;
                DrumPad pad = drumPadBank.getItemAt(padIndex);
                setUpPad(padIndex, pad);
                final RgbButton button = hwElements.getGridButton(7 - rowIndex, columnIndex);
                button.bindLight(this, () -> getPadLight(padIndex, pad));
                button.bindPressed(muteLayer, () -> pad.mute().toggle());
                button.bindLight(muteLayer, () -> getPadMuteLight(padIndex, pad));
                button.bindIsPressed(soloLayer, pressed -> handleSolo(pressed, pad));
                button.bindLight(soloLayer, () -> getPadSoloLight(padIndex, pad));
                button.bindPressed(shiftLayer, () -> handleSelect(padIndex, pad));
                button.bindPressed(clearLayer, () -> clearNotes(padIndex));
            }
        }
        for (int row = 4; row < 6; row++) {
            for (int col = 4; col < 8; col++) {
                final RgbButton button = hwElements.getGridButton(row, col);
                int index = (5 - row) * 4 + (col - 4);
                button.bindPressed(this, () -> selectVelocity(index));
                button.bindLight(this, () -> getVelocityColors(index));
            }
        }
        for (int row = 6; row < 8; row++) {
            for (int col = 4; col < 8; col++) {
                final RgbButton button = hwElements.getGridButton(row, col);
                int index = (7 - row) * 4 + (col - 4);
                button.bindIsPressed(this, pressed -> setNoteRepeat(index, pressed));
                button.bindLight(this, () -> getNoteRepeatColors(index));
            }
        }
    }

    private void handleSelect(int padIndex, DrumPad pad) {
        if (isSelected[padIndex]) {
            PinnableCursorDevice cursorDevice = viewControl.getDeviceControl().getCursorDevice();
            if (cursorDevice.hasDrumPads().get()) {
                cursorDevice.selectFirstInKeyPad(padToNote[padIndex]);
            } else {
                cursorDevice.selectParent();
            }
        } else {
            pad.selectInEditor();
        }
    }

    private void handleSolo(boolean pressed, DrumPad pad) {
        if (pressed) {
            pad.solo().toggle(soloHeld == 0);
            soloHeld++;
        } else {
            soloHeld--;
        }
    }

    private void setNoteRepeat(int index, boolean pressed) {
        if (pressed) {
            if (index == selectedNoteRepeatIndex) {
                selectedNoteRepeatIndex = -1;
                arp.isEnabled().set(false);
                mainDisplay.enterMode(MainDisplay.ScreenMode.INFO, "Note Repeat", "Off");
            } else {
                selectedNoteRepeatIndex = index;
                mainDisplay.enterMode(MainDisplay.ScreenMode.INFO, "Note Repeat",
                        rateDisplayValues[selectedNoteRepeatIndex]);
                double arpRate = arpRateTable[selectedNoteRepeatIndex];
                arp.rate().set(arpRate);
                arp.mode().set("all"); // that's the note repeat way
                arp.octaves().set(0);
                arp.humanize().set(0);
                arp.isFreeRunning().set(false);
                arp.isEnabled().set(true);
            }
        }
    }

    private RgbLightState getNoteRepeatColors(int padIndex) {
        if (selectedNoteRepeatIndex == padIndex) {
            return RgbLightState.WHITE;
        }
        return RgbLightState.of(ARP_COLORS[padIndex]);
    }


    private void selectVelocity(int index) {
        if (index == selectedVelocityIndex) {
            selectedVelocityIndex = -1;
            fixedVelocity = -1;
            setVelocity(-1);
            this.noteInput.setVelocityTranslationTable(velocityTable);
            mainDisplay.enterMode(MainDisplay.ScreenMode.INFO, "Fixed Velocity", "Off");
        } else {
            selectedVelocityIndex = index;
            fixedVelocity = VEL_TABLE[selectedVelocityIndex];
            mainDisplay.enterMode(MainDisplay.ScreenMode.INFO, "Fixed Velocity", "%d".formatted(fixedVelocity));
            setVelocity(fixedVelocity);
            this.noteInput.setVelocityTranslationTable(velocityTable);
        }
    }

    private RgbLightState getVelocityColors(int padIndex) {
        if (selectedVelocityIndex == padIndex) {
            return RgbLightState.WHITE;
        }
        LedBehavior behavior = padIndex % 2 == 0 ? LedBehavior.LIGHT_50 : LedBehavior.FULL;
        return RgbLightState.of(FIXED_COLORS[padIndex], behavior);
    }

    private void clearNotes(int padIndex) {
        if (padToNote[padIndex] != -1) {
            focusClip.clearNotes(padToNote[padIndex]);
        }
    }

    private RgbLightState getPadMuteLight(int padIndex, DrumPad pad) {
        if (pad.exists().get()) {
            if (pad.mute().get()) {
                return isPlaying(padIndex) ? RgbLightState.MUTE_PLAY_FULL : RgbLightState.ORANGE_FULL;
            } else {
                return isPlaying(padIndex) ? RgbLightState.MUTE_PLAY_DIM : RgbLightState.ORANGE_DIM;
            }
        }
        return isPlaying(padIndex) ? RgbLightState.WHITE : RgbLightState.WHITE_DIM;
    }

    private RgbLightState getPadSoloLight(int padIndex, DrumPad pad) {
        if (pad.exists().get()) {
            if (pad.solo().get()) {
                return isPlaying(padIndex) ? RgbLightState.SOLO_PLAY_FULL : RgbLightState.YELLOW_FULL;
            } else {
                return isPlaying(padIndex) ? RgbLightState.SOLO_PLAY_YELLOW_DIM : RgbLightState.YELLOW_DIM;
            }
        }
        return isPlaying(padIndex) ? RgbLightState.WHITE : RgbLightState.WHITE_DIM;
    }

    private RgbLightState getPadLight(int padIndex, DrumPad pad) {
        if (isSelected[padIndex]) {
            return isPlaying(padIndex) ? RgbLightState.WHITE : RgbLightState.WHITE_SEL;
        }
        if (pad.exists().get()) {
            LedBehavior lightState = isPlaying(padIndex) ? LedBehavior.FULL : LedBehavior.LIGHT_25;
            if (padColors[padIndex] != 0) {
                return RgbLightState.of(padColors[padIndex], lightState);
            } else {
                return RgbLightState.of(viewControl.getCursorTrackColor(), lightState);
            }
        }
        return isPlaying(padIndex) ? RgbLightState.WHITE : RgbLightState.WHITE_DIM;
    }

    private void handleHasDrumPadsChanged(boolean hasDrumPads) {
        this.inDrumMode = hasDrumPads;
        if (isActive() && currentMode.isKeyRelated()) {
            midiProcessor.setDrumMode(hasDrumPads);
        }
    }

    private void handleNotes(final PlayingNote[] playingNotes) {
        if (!isActive()) {
            return;
        }
        Arrays.fill(isPlaying, false);
        for (final PlayingNote playingNote : playingNotes) {
            isPlaying[playingNote.pitch()] = true;
        }
    }

    public void activateMute(boolean activated) {
        if (!isActive()) {
            return;
        }
        soloHeld = 0;
        muteLayer.setIsActive(activated);
        padActivation(activated);
    }

    public void activateSolo(boolean activated) {
        if (!isActive()) {
            return;
        }
        soloLayer.setIsActive(activated);
        padActivation(activated);
    }

    private void padActivation(boolean activated) {
        if (activated) {
            deactivateNotes();
        } else if (!shiftLayer.isActive() && !clearLayer.isActive()) {
            applyScale();
        }
    }

    public boolean isPlaying(final int index) {
        final int offset = padOffset + index;
        if (offset < 128) {
            return isPlaying[offset];
        }
        return false;
    }

    private void handlePadBankScrolling(int scrollPos) {
        padOffset = scrollPos;
        selectPad(getSelectedIndex());
        if (isActive()) {
            applyScale();
        }
    }

    void selectPad(final int index) {
        final DrumPad pad = drumPadBank.getItemAt(index);
        pad.selectInEditor();
    }

    private int getSelectedIndex() {
        for (int i = 0; i < 16; i++) {
            if (isSelected[i]) {
                return i;
            }
        }
        return 0;
    }

    public void navigateBy(int amount) {
        drumPadBank.scrollBy(amount);
    }

    public boolean canNavigateBy(int amount) {
        int newOffset = amount + padOffset;
        return newOffset >= 0 && newOffset < 112;
    }

    void applyScale() {
        Arrays.fill(noteTable, -1);
        if (inDrumMode) {
            for (int i = 0; i < 16; i++) {
                int noteIndex = (i / 4) * 8 + i % 4;
                noteTable[noteIndex] = padOffset + i;
                padToNote[i] = padOffset + i;
            }
        }
        if (isActive()) {
            noteInput.setKeyTranslationTable(noteTable);
            noteInput.setVelocityTranslationTable(velocityTable);
            this.noteInput.setShouldConsumeEvents(true);
        }
    }

    private void setUpPad(int index, DrumPad pad) {
        pad.color().addValueObserver((r, g, b) -> padColors[index] = ColorLookup.toColor(r, g, b));
        pad.name().markInterested();
        pad.exists().markInterested();
        pad.solo().markInterested();
        pad.mute().markInterested();
        pad.addIsSelectedInEditorObserver(selected -> isSelected[index] = selected);
    }

    private void applyLayers() {
        if (!isActive()) {
            return;
        }
        if (states.isClear()) {
            clearLayer.setIsActive(true);
            shiftLayer.setIsActive(false);
            deactivateNotes();
        } else if (states.isShift()) {
            shiftLayer.setIsActive(true);
            clearLayer.setIsActive(false);
            deactivateNotes();
        } else {
            clearLayer.setIsActive(false);
            shiftLayer.setIsActive(false);
            applyScale();
        }
    }

    @Override
    protected void onActivate() {
        super.onActivate();
        if ((currentMode.isKeyRelated()) && inDrumMode) {
            midiProcessor.setDrumMode(true);
            applyScale();
        }
    }

    @Override
    protected void onDeactivate() {
        super.onDeactivate();
        deactivateNotes();
        soloHeld = 0;
        shiftLayer.setIsActive(false);
        clearLayer.setIsActive(false);
        muteLayer.setIsActive(false);
        soloLayer.setIsActive(false);
    }

    private void deactivateNotes() {
        Arrays.fill(noteTable, -1);
        noteInput.setKeyTranslationTable(noteTable);
    }


}



================================================
FILE: src/main/java/com/bitwig/extensions/controllers/akai/apc64/layer/ParameterControlLayer.java
================================================
package com.bitwig.extensions.controllers.akai.apc64.layer;

import com.bitwig.extension.controller.api.*;
import com.bitwig.extensions.controllers.akai.apc.common.led.ColorLookup;
import com.bitwig.extensions.controllers.akai.apc.common.led.RgbLightState;
import com.bitwig.extensions.controllers.akai.apc.common.led.VarSingleLedState;
import com.bitwig.extensions.controllers.akai.apc64.Apc64CcAssignments;
import com.bitwig.extensions.controllers.akai.apc64.DeviceControl;
import com.bitwig.extensions.controllers.akai.apc64.HardwareElements;
import com.bitwig.extensions.controllers.akai.apc64.ViewControl;
import com.bitwig.extensions.controllers.akai.apc64.control.FaderLightState;
import com.bitwig.extensions.controllers.akai.apc64.control.SingleLedButton;
import com.bitwig.extensions.controllers.akai.apc64.control.TouchSlider;
import com.bitwig.extensions.framework.Layer;
import com.bitwig.extensions.framework.Layers;
import com.bitwig.extensions.framework.di.Activate;
import com.bitwig.extensions.framework.di.Component;
import com.bitwig.extensions.framework.di.Inject;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class ParameterControlLayer extends Layer {


    private enum Mode {
        DEVICE(Apc64CcAssignments.STRIP_DEVICE),
        VOLUME(Apc64CcAssignments.STRIP_VOLUME),
        PAN(Apc64CcAssignments.STRIP_PAN),
        SENDS(Apc64CcAssignments.STRIP_SENDS),
        CHANNEL_STRIP(Apc64CcAssignments.STRIP_CHANNEL),
        OFF(Apc64CcAssignments.STRIP_OFF);
        private final Apc64CcAssignments assignment;

        Mode(Apc64CcAssignments assignment) {
            this.assignment = assignment;
        }

        public Apc64CcAssignments getAssignment() {
            return assignment;
        }
    }

    private Mode currentMode = Mode.VOLUME;
    private DeviceControl.Focus currentDeviceFocus = DeviceControl.Focus.DEVICE;
    private final Map<Mode, Layer> modes = new HashMap<>();
    private final Map<DeviceControl.Focus, Layer> deviceModes = new HashMap<>();

    @Inject
    private NavigationLayer navigationSection;

    private final ViewControl viewControl;
    private int cursorTrackColor = 0;
    private final MainDisplay display;

    public ParameterControlLayer(final Layers layers, HardwareElements hwElements, ViewControl viewControl,
                                 MainDisplay mainDisplay) {
        super(layers, "PARAMETER CONTROL");
        this.viewControl = viewControl;
        this.display = mainDisplay;
        Arrays.stream(Mode.values()).forEach(mode -> modes.put(mode, new Layer(layers, "STRIP_" + mode.toString())));
        Arrays.stream(DeviceControl.Focus.values())
                .forEach(mode -> deviceModes.put(mode, new Layer(layers, "DEVICE_" + mode.toString())));
        deviceModes.put(DeviceControl.Focus.DEVICE, modes.get(Mode.DEVICE));
        bindModeToButton(hwElements, Mode.DEVICE);
        bindModeToButton(hwElements, Mode.VOLUME);
        bindModeToButton(hwElements, Mode.PAN);
        bindModeToButton(hwElements, Mode.SENDS);
        bindModeToButton(hwElements, Mode.CHANNEL_STRIP);
        bindModeToButton(hwElements, Mode.OFF);
        TouchSlider[] touchSliders = hwElements.getTouchSliders();
        bindVolumeLayer(touchSliders, viewControl.getTrackBank());
        bindPanLayer(touchSliders, viewControl.getTrackBank());
        bindSendsLayer(touchSliders, viewControl.getTrackBank());
        bindCursorLayer(touchSliders, viewControl.getCursorTrack());
        bindDeviceLayer(hwElements, viewControl.getDeviceControl());
        bindOffLayer(touchSliders);
    }

    private void bindDeviceLayer(HardwareElements hwElements, DeviceControl deviceControl) {
        TouchSlider[] sliders = hwElements.getTouchSliders();

        bindToPage(sliders, deviceModes.get(DeviceControl.Focus.DEVICE),
                deviceControl.getPage(DeviceControl.Focus.DEVICE), this::faderTrackColorProvider);
        bindToPage(sliders, deviceModes.get(DeviceControl.Focus.TRACK),
                deviceControl.getPage(DeviceControl.Focus.TRACK), this::faderTrackColorProvider);
        bindToPage(sliders, deviceModes.get(DeviceControl.Focus.PROJECT),
                deviceControl.getPage(DeviceControl.Focus.PROJECT), this::faderProjectColorProvider);
        deviceControl.setFocusListener(focus -> changeDeviceFocus(focus));
    }

    private void bindToPage(TouchSlider[] sliders, Layer layer, CursorRemoteControlsPage remotePage,
                            Function<Parameter, RgbLightState> colorProvider) {
        for (int i = 0; i < sliders.length; i++) {
            TouchSlider slider = sliders[i];
            RemoteControl parameter = remotePage.getParameter(i);
            parameter.exists().markInterested();
            parameter.name().markInterested();
            bindSlider(layer, slider, parameter, colorProvider);
        }
    }

    private void bindSlider(Layer layer, TouchSlider slider, RemoteControl parameter,
                            Function<Parameter, RgbLightState> colorProvider) {
        slider.bindParameter(layer, display, parameter.name(), parameter);
        slider.bindIsPressed(layer, pressed -> parameter.touch(pressed));
        slider.bindLightColor(layer, () -> colorProvider.apply(parameter));
        slider.bindLightState(layer, () -> !parameter.exists().get() ? FaderLightState.OFF : FaderLightState.V_WHITE);
    }

    private RgbLightState faderTrackColorProvider(Parameter parameter) {
        if (parameter.exists().get()) {
            return RgbLightState.of(cursorTrackColor);
        }
        return RgbLightState.OFF;
    }

    private RgbLightState faderProjectColorProvider(Parameter parameter) {
        if (parameter.exists().get()) {
            return RgbLightState.WHITE;
        }
        return RgbLightSt